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
  const [liveSearchError, setLiveSearchError] = useState<boolean>(false);

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
        // Clear manual override if new location matches geofence
        if (dist) setManualDistrictId(null);
      }

      // High accuracy fresh check
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
    // If offline or no coordinates, skip real-time searching
    if (!isOnline || !location) {
      setLiveContacts([]);
      return;
    }

    const triggerLiveSearch = async () => {
      setIsFetchingLive(true);
      setLiveSearchError(false);
      try {
        const osmResults = await searchNearbyOsmFacilities(
          location.latitude,
          location.longitude
        );
        setLiveContacts(osmResults);
      } catch (err) {
        console.error('OSM Search Error:', err);
        setLiveSearchError(true);
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

  // Determine active district configuration
  const activeDistrictId = manualDistrictId || resolvedDistrict?.id || null;

  // Compile offline contacts
  const localContacts = useMemo(() => {
    if (activeDistrictId) {
      return getContactsByDistrict(activeDistrictId);
    }
    return NATIONAL_CONTACTS;
  }, [activeDistrictId]);

  // Deduplicate and merge live OSM feeds and local contacts
  const mergedContacts = useMemo(() => {
    const allUniqueContacts: EmergencyContact[] = [];
    const seenPhones = new Set<string>();

    // Prioritize national numbers at the very top (never duplicate)
    NATIONAL_CONTACTS.forEach((c) => {
      allUniqueContacts.push(c);
      seenPhones.add(c.phone);
    });

    // Add live map search elements (filter out duplicates with existing national helplines)
    liveContacts.forEach((c) => {
      if (!seenPhones.has(c.phone)) {
        allUniqueContacts.push(c);
        seenPhones.add(c.phone);
      }
    });

    // Add local database elements (filter out duplicates)
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

  return (
    <SafeAreaView style={THEME.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.cardBg} />

      {/* Header Bar */}
      <View style={THEME.header}>
        <View style={THEME.logoContainer}>
          <Text style={THEME.logoUrdu}>فریاد</Text>
          <Text style={THEME.logoEnglish}>FARYAAD</Text>
        </View>
        <TouchableOpacity style={THEME.langButton} onPress={toggleLanguage}>
          <Text style={THEME.langButtonText}>
            {getTranslation(lang, 'changeLangBtn')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <View style={THEME.offlineBanner}>
          <Text style={THEME.offlineBannerText}>
            ⚠ {getTranslation(lang, 'offlineBanner')}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={THEME.scrollContainer}>
        {/* Current Location Display Card */}
        <View style={THEME.locationCard}>
          <View style={THEME.locationTitleRow}>
            <Text style={THEME.locationTitleText}>
              📍 {getTranslation(lang, 'myLocation')}
            </Text>
            <View
              style={[
                THEME.locationStatusBadge,
                {
                  backgroundColor: isOnline
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(245, 158, 11, 0.15)',
                },
              ]}
            >
              <View
                style={[
                  THEME.statusBadgeDot,
                  { backgroundColor: isOnline ? COLORS.onlineGreen : COLORS.ambulanceGold },
                ]}
              />
              <Text
                style={[
                  THEME.statusBadgeText,
                  { color: isOnline ? COLORS.onlineGreen : COLORS.ambulanceGold },
                ]}
              >
                {isOnline ? getTranslation(lang, 'statusOnline') : getTranslation(lang, 'statusOffline')}
              </Text>
            </View>
          </View>

          {isLocating ? (
            <ActivityIndicator size="small" color={COLORS.emergencyRed} />
          ) : (
            <View>
              {manualDistrictId ? (
                // Manual selection active
                <View>
                  {(() => {
                    const matched = DISTRICTS_LIST.find((d) => d.id === manualDistrictId);
                    return (
                      <>
                        <Text style={THEME.locationTextUrdu}>
                          {matched?.nameUr} ({matched?.provinceUr})
                        </Text>
                        <Text style={THEME.locationTextEn}>
                          {matched?.nameEn}, {matched?.provinceEn}
                        </Text>
                      </>
                    );
                  })()}
                </View>
              ) : resolvedDistrict ? (
                // Resolved via geofence
                <View>
                  <Text style={THEME.locationTextUrdu}>
                    {resolvedDistrict.nameUr} ({resolvedDistrict.provinceUr})
                  </Text>
                  <Text style={THEME.locationTextEn}>
                    {resolvedDistrict.nameEn}, {resolvedDistrict.provinceEn}
                  </Text>
                </View>
              ) : (
                // General fallback / Out of bounds
                <View>
                  <Text style={THEME.locationTextUrdu}>پاکستان (ملک گیر)</Text>
                  <Text style={THEME.locationTextEn}>Pakistan (Nationwide)</Text>
                </View>
              )}
            </View>
          )}

          {/* Location Coordinates block */}
          {location && (
            <View style={THEME.coordsRow}>
              <View style={THEME.coordCol}>
                <Text style={THEME.coordLabel}>{getTranslation(lang, 'coordinates')}</Text>
                <Text style={THEME.coordVal}>
                  {location.latitude.toFixed(5)}° N, {location.longitude.toFixed(5)}° E
                </Text>
              </View>
              <View style={[THEME.coordCol, { alignItems: 'flex-end' }]}>
                <Text style={THEME.coordLabel}>{getTranslation(lang, 'accuracy')}</Text>
                <Text style={THEME.coordVal}>
                  ±{location.accuracy ? location.accuracy.toFixed(0) : '0'} {getTranslation(lang, 'meters')}
                </Text>
              </View>
            </View>
          )}

          {/* Accuracy alert */}
          {location && location.accuracy && location.accuracy > 50 && (
            <Text style={{ color: COLORS.ambulanceGold, fontSize: 11, marginTop: 8, fontWeight: '600' }}>
              ⚠ {getTranslation(lang, 'gpsAccuracyWarning')}
            </Text>
          )}

          {/* Manual override button / GPS revert */}
          {manualDistrictId ? (
            <TouchableOpacity style={THEME.gpsResetBtn} onPress={clearManualOverride}>
              <Text style={THEME.gpsResetBtnText}>🔄 {getTranslation(lang, 'backToGps')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={THEME.overrideBtn} onPress={() => setModalVisible(true)}>
              <Text style={THEME.overrideBtnText}>🔍 {getTranslation(lang, 'manualLocationBtn')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* High-urgency Disclaimer */}
        <View style={THEME.disclaimerBox}>
          <Text style={THEME.disclaimerTitle}>
            ⚠ {lang === 'ur' ? 'ضروری ہدایت' : 'Emergency Instruction'}
          </Text>
          <Text style={THEME.disclaimerText}>
            {getTranslation(lang, 'callDisclaimer')}
          </Text>
        </View>

        {/* Emergency Services Listing */}
        <Text style={lang === 'ur' ? THEME.sectionTitleUrdu : THEME.sectionTitle}>
          {getTranslation(lang, 'nationalHelplines')} / {getTranslation(lang, 'localServices')}
        </Text>

        {/* Real-time loader indicator */}
        {isFetchingLive && (
          <View style={[THEME.loaderBox, { marginBottom: 12 }]}>
            <ActivityIndicator size="small" color={COLORS.ambulanceGold} />
            <Text style={THEME.loaderText}>{getTranslation(lang, 'loadingLive')}</Text>
          </View>
        )}

        {/* Render contacts */}
        {mergedContacts.length === 0 ? (
          <View style={THEME.emptyBox}>
            <Text style={THEME.emptyText}>
              {lang === 'ur' ? 'کوئی نمبر دستیاب نہیں ہے' : 'No emergency contacts resolved.'}
            </Text>
          </View>
        ) : (
          mergedContacts.map((contact) => (
            <View key={contact.id} style={THEME.card}>
              <View style={THEME.cardDetails}>
                <View style={THEME.cardHeaderRow}>
                  <Text
                    style={[
                      THEME.badge,
                      contact.source === 'live_map' ? THEME.badgeLive : THEME.badgeVerified,
                    ]}
                  >
                    {contact.source === 'live_map'
                      ? getTranslation(lang, 'liveFeeds').toUpperCase()
                      : getTranslation(lang, 'verifiedDb').toUpperCase()}
                  </Text>
                  {contact.distanceKm !== undefined && (
                    <Text style={THEME.distanceText}>
                      ⚡ {contact.distanceKm} {lang === 'ur' ? 'کلومیٹر' : 'km'}
                    </Text>
                  )}
                </View>

                <Text style={lang === 'ur' ? THEME.cardTitleUr : THEME.cardTitleEn}>
                  {lang === 'ur' ? contact.nameUr : contact.nameEn}
                </Text>
                
                <Text style={{ fontSize: 12, color: COLORS.ambulanceGold, marginTop: 4, fontWeight: '700' }}>
                  📞 {contact.phone}
                </Text>

                <Text style={THEME.cardAddress} numberOfLines={2}>
                  📍 {lang === 'ur' && contact.addressUr ? contact.addressUr : contact.addressEn}
                </Text>
              </View>

              <TouchableOpacity style={THEME.callBtn} onPress={() => initiateCall(contact.phone)}>
                <Text style={lang === 'ur' ? THEME.callBtnTextUr : THEME.callBtnTextEn}>
                  {getTranslation(lang, 'callBtn')}
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
              <Text style={lang === 'ur' ? THEME.modalTitleUr : THEME.modalTitleEn}>
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
                  <View style={THEME.districtDetails}>
                    <Text style={THEME.districtNameEn}>{item.nameEn}</Text>
                    <Text style={THEME.districtProvinceEn}>{item.provinceEn}</Text>
                  </View>
                  <View>
                    <Text style={THEME.districtNameUr}>{item.nameUr}</Text>
                    <Text style={THEME.districtProvinceUr}>{item.provinceUr}</Text>
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
