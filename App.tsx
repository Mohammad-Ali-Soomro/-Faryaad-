import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

// Theme, database, geolocation, and search imports
import { COLORS, THEME } from './src/theme/styles';
import {
  EmergencyContact,
  getContactsByDistrict,
  DISTRICTS_LIST,
  NATIONAL_CONTACTS,
} from './src/db/emergencyContacts';
import { resolveDistrictOffline } from './src/geo/offlineGeocoder';
import { searchNearbyOsmFacilities } from './src/api/osmSearch';
import { Language, getTranslation } from './src/i18n/localization';

export default function App() {
  // Localization State
  const [lang, setLang] = useState<Language>('ur'); // Default to Urdu for remote accessibility

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Geolocation State
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Collapsible GPS coordinates state
  const [showCoordsPanel, setShowCoordsPanel] = useState<boolean>(false);

  // Resolved Geofence and Manual Selection
  const [resolvedDistrict, setResolvedDistrict] = useState<{
    id: string;
    nameEn: string;
    nameUr: string;
    provinceEn: string;
    provinceUr: string;
  } | null>(null);
  const [manualDistrictId, setManualDistrictId] = useState<string | null>(null);

  // Search Results
  const [liveContacts, setLiveContacts] = useState<EmergencyContact[]>([]);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  // Modal State for manual override
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Listen for Network Changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Location
  const fetchLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setIsLocating(false);
        return;
      }

      // Quick check: Last known position
      const lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        const coords = {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
          accuracy: lastKnown.coords.accuracy,
        };
        setLocation(coords);
        const dist = resolveDistrictOffline(coords.latitude, coords.longitude);
        setResolvedDistrict(dist);
        if (dist) setManualDistrictId(null);
      }

      // Fresh high accuracy query
      const freshLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: freshLocation.coords.latitude,
        longitude: freshLocation.coords.longitude,
        accuracy: freshLocation.coords.accuracy,
      };
      setLocation(coords);
      const dist = resolveDistrictOffline(coords.latitude, coords.longitude);
      setResolvedDistrict(dist);
      if (dist) setManualDistrictId(null);
      
      setGpsActive(true);
    } catch (err: any) {
      console.error('GPS fetching error:', err);
      setLocationError('Could not fetch GPS. Please select manually.');
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Run location fetcher on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // 3. Dynamic Live OSM Searching
  useEffect(() => {
    if (!isOnline || !location) {
      setLiveContacts([]);
      return;
    }

    const triggerLiveSearch = async () => {
      setIsFetchingLive(true);
      try {
        const osmResults = await searchNearbyOsmFacilities(
          location.latitude,
          location.longitude
        );
        setLiveContacts(osmResults);
      } catch (err) {
        console.error('OSM Search Error:', err);
        setLiveContacts([]);
      } finally {
        setIsFetchingLive(false);
      }
    };

    triggerLiveSearch();
  }, [location, isOnline]);

  // Toggle Language
  const toggleLanguage = () => {
    setLang((current) => (current === 'en' ? 'ur' : 'en'));
  };

  // Trigger Phone Call
  const initiateCall = (phone: string) => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          alert(lang === 'ur' ? 'اس فون پر کال کرنا ممکن نہیں ہے' : 'Phone calling is not supported on this device');
        }
      })
      .catch((err) => console.error('Call Error:', err));
  };

  // Active district resolution
  const activeDistrictId = manualDistrictId || resolvedDistrict?.id || null;

  // Compile offline contacts (national helplines are separated into the top speed dial grid)
  const localContacts = useMemo(() => {
    if (activeDistrictId) {
      // Exclude national numbers since they are featured in the speed dial grid
      return getContactsByDistrict(activeDistrictId).filter(
        (c) => !NATIONAL_CONTACTS.some((nc) => nc.phone === c.phone)
      );
    }
    return [];
  }, [activeDistrictId]);

  // Deduplicate and merge live OSM feeds and local contacts
  const mergedContacts = useMemo(() => {
    const allUniqueContacts: EmergencyContact[] = [];
    const seenPhones = new Set<string>();

    // Skip numbers featured in the top speed dial
    NATIONAL_CONTACTS.forEach((c) => {
      seenPhones.add(c.phone);
    });

    // Add live map search elements
    liveContacts.forEach((c) => {
      if (!seenPhones.has(c.phone)) {
        allUniqueContacts.push(c);
        seenPhones.add(c.phone);
      }
    });

    // Add local database elements
    localContacts.forEach((c) => {
      if (!seenPhones.has(c.phone)) {
        allUniqueContacts.push(c);
        seenPhones.add(c.phone);
      }
    });

    return allUniqueContacts;
  }, [liveContacts, localContacts]);

  // District list filtered by search query
  const filteredDistricts = useMemo(() => {
    return DISTRICTS_LIST.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.nameUr.includes(searchQuery)
    );
  }, [searchQuery]);

  const selectManualDistrict = (id: string) => {
    setManualDistrictId(id);
    setModalVisible(false);
    setSearchQuery('');
  };

  const clearManualOverride = () => {
    setManualDistrictId(null);
    fetchLocation();
  };

  // Resolve current active location text
  const activeLocationText = useMemo(() => {
    if (isLocating) {
      return getTranslation(lang, 'unknownLocation');
    }
    if (manualDistrictId) {
      const matched = DISTRICTS_LIST.find((d) => d.id === manualDistrictId);
      return lang === 'ur'
        ? `${matched?.nameUr} (${matched?.provinceUr}) ✏`
        : `${matched?.nameEn}, ${matched?.provinceEn} ✏`;
    }
    if (resolvedDistrict) {
      return lang === 'ur'
        ? `${resolvedDistrict.nameUr} (${resolvedDistrict.provinceUr}) ✏`
        : `${resolvedDistrict.nameEn}, ${resolvedDistrict.provinceEn} ✏`;
    }
    return lang === 'ur' ? 'پاکستان (ملک گیر) ✏' : 'Pakistan (Nationwide) ✏';
  }, [isLocating, resolvedDistrict, manualDistrictId, lang]);

  return (
    <SafeAreaView style={THEME.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardBg} />

      {/* Header Bar */}
      <View style={THEME.header}>
        <View style={THEME.logoContainer}>
          <Text style={THEME.logoText}>{lang === 'ur' ? 'فریاد' : 'FARYAAD'}</Text>
          <View style={THEME.logoBadge}>
            <Text style={THEME.logoBadgeText}>SOS</Text>
          </View>
        </View>
        <TouchableOpacity style={THEME.langButton} onPress={toggleLanguage}>
          <Text style={THEME.langButtonText}>
            {getTranslation(lang, 'changeLangBtn')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Low-profile Location Banner */}
      <TouchableOpacity
        style={THEME.locationBar}
        onPress={() => setShowCoordsPanel(!showCoordsPanel)}
      >
        <Text style={THEME.locationBarText}>📍 {activeLocationText}</Text>
        <Text style={THEME.locationChangeLink}>
          {showCoordsPanel ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Collapsible Coordinates & Override Panel */}
      {showCoordsPanel && (
        <View style={THEME.coordsPanel}>
          {location ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={THEME.coordsTitle}>{getTranslation(lang, 'coordinates')}</Text>
                <Text style={THEME.coordsVal}>
                  {location.latitude.toFixed(5)}° N, {location.longitude.toFixed(5)}° E
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={THEME.coordsTitle}>{getTranslation(lang, 'accuracy')}</Text>
                <Text style={THEME.coordsVal}>
                  ±{location.accuracy ? location.accuracy.toFixed(0) : '0'} {getTranslation(lang, 'meters')}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
              {locationError || getTranslation(lang, 'unknownLocation')}
            </Text>
          )}

          <View style={THEME.gpsButtonsRow}>
            <TouchableOpacity style={THEME.gpsBtn} onPress={() => setModalVisible(true)}>
              <Text style={THEME.gpsBtnText}>🔍 {getTranslation(lang, 'manualLocationBtn')}</Text>
            </TouchableOpacity>

            {manualDistrictId && (
              <TouchableOpacity style={[THEME.gpsBtn, { borderColor: COLORS.btnActive }]} onPress={clearManualOverride}>
                <Text style={[THEME.gpsBtnText, { color: COLORS.textMain }]}>🔄 {getTranslation(lang, 'backToGps')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Offline Alert Banner */}
      {!isOnline && (
        <View style={THEME.offlineBanner}>
          <Text style={THEME.offlineBannerText}>
            ⚠ {getTranslation(lang, 'offlineBanner')}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={THEME.scrollContainer}>
        {/* Urgent Speed Dial section */}
        <Text style={THEME.speedDialTitle}>
          🚨 {getTranslation(lang, 'nationalHelplines')}
        </Text>

        <View style={THEME.speedDialGrid}>
          {/* Rescue 1122 */}
          <TouchableOpacity
            style={[THEME.speedDialCard, THEME.speedDialCardRed]}
            onPress={() => initiateCall('1122')}
          >
            <Text style={THEME.speedDialNumber}>1122</Text>
            <Text style={THEME.speedDialLabel}>
              {lang === 'ur' ? 'ریسکیو' : 'RESCUE'}
            </Text>
            <Text style={THEME.speedDialSubLabel}>
              {lang === 'ur' ? 'سرکاری ایمرجنسی' : 'Govt Emergency'}
            </Text>
          </TouchableOpacity>

          {/* Edhi 115 */}
          <TouchableOpacity
            style={[THEME.speedDialCard, THEME.speedDialCardGold]}
            onPress={() => initiateCall('115')}
          >
            <Text style={THEME.speedDialNumber}>115</Text>
            <Text style={THEME.speedDialLabel}>
              {lang === 'ur' ? 'ایدھی' : 'EDHI'}
            </Text>
            <Text style={THEME.speedDialSubLabel}>
              {lang === 'ur' ? 'ایمبولینس' : 'Ambulance'}
            </Text>
          </TouchableOpacity>

          {/* Chhipa 1020 */}
          <TouchableOpacity
            style={[THEME.speedDialCard, THEME.speedDialCardGold]}
            onPress={() => initiateCall('1020')}
          >
            <Text style={THEME.speedDialNumber}>1020</Text>
            <Text style={THEME.speedDialLabel}>
              {lang === 'ur' ? 'چھیپا' : 'CHHIPA'}
            </Text>
            <Text style={THEME.speedDialSubLabel}>
              {lang === 'ur' ? 'ایمبولینس' : 'Ambulance'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* High-urgency Disclaimer */}
        <View style={THEME.disclaimerBox}>
          <Text style={THEME.disclaimerText}>
            ℹ {getTranslation(lang, 'callDisclaimer')}
          </Text>
        </View>

        {/* Section header for Nearby results */}
        <View style={THEME.sectionHeader}>
          <Text style={THEME.sectionTitle}>
            🏨 {getTranslation(lang, 'localServices')}
          </Text>
          {isOnline && (
            <View style={THEME.liveBadge}>
              <View style={THEME.liveBadgeDot} />
              <Text style={THEME.liveBadgeText}>
                {getTranslation(lang, 'liveFeeds').toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Dynamic loader */}
        {isFetchingLive && (
          <View style={THEME.loaderBox}>
            <ActivityIndicator size="small" color={COLORS.ambulanceGold} />
            <Text style={THEME.loaderText}>{getTranslation(lang, 'loadingLive')}</Text>
          </View>
        )}

        {/* Render nearby / local merged contacts */}
        {mergedContacts.length === 0 ? (
          !isFetchingLive && (
            <View style={THEME.loaderBox}>
              <Text style={THEME.loaderText}>
                {lang === 'ur' ? 'کوئی قریبی نمبر نہیں ملا' : 'No nearby services resolved.'}
              </Text>
            </View>
          )
        ) : (
          mergedContacts.map((contact) => (
            <View key={contact.id} style={THEME.card}>
              <View style={THEME.cardDetails}>
                <Text style={THEME.cardCategory}>
                  {lang === 'ur' ? contact.categoryUr : contact.categoryEn}
                </Text>
                
                <Text style={THEME.cardTitle}>
                  {lang === 'ur' ? contact.nameUr : contact.nameEn}
                </Text>

                <View style={THEME.cardMetaRow}>
                  {contact.distanceKm !== undefined && (
                    <Text style={THEME.cardMetaItem}>
                      📍 {contact.distanceKm} {lang === 'ur' ? 'کلو میٹر' : 'km'}
                    </Text>
                  )}
                  <Text style={[THEME.cardMetaItem, THEME.cardMetaPhone]}>
                    📞 {contact.phone}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={THEME.callBtn} onPress={() => initiateCall(contact.phone)}>
                <Text style={THEME.callBtnText}>
                  {lang === 'ur' ? 'کال کریں' : 'CALL'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Manual Selection Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={THEME.modalContainer}>
          <View style={THEME.modalContent}>
            <View style={THEME.modalHeader}>
              <Text style={THEME.modalTitle}>
                {getTranslation(lang, 'selectDistrictTitle')}
              </Text>
              <TouchableOpacity style={THEME.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={THEME.closeBtnText}>❌</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={THEME.searchInput}
              placeholder={getTranslation(lang, 'searchPlaceholder')}
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />

            <FlatList
              data={filteredDistricts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={THEME.districtItem}
                  onPress={() => selectManualDistrict(item.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={THEME.districtName}>
                      {lang === 'ur' ? item.nameUr : item.nameEn}
                    </Text>
                    <Text style={THEME.districtProvince}>
                      {lang === 'ur' ? item.provinceUr : item.provinceEn}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: COLORS.textMuted }}>
                    {lang === 'ur' ? 'کوئی اضلاع نہیں ملیں' : 'No matching districts found.'}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
