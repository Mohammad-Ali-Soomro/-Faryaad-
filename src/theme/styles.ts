import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  background: '#0B0F19', // Deep pitch dark for battery saving and high contrast
  cardBg: '#161D30',     // Premium dark navy-slate card
  cardBorder: '#232D45', // Subtle card borders
  textMain: '#F8FAFC',   // Ice white text
  textMuted: '#94A3B8',  // Soft gray text
  
  // High-urgency colors
  emergencyRed: '#EF4444',  // Solid active distress red
  emergencyRedGlow: 'rgba(239, 68, 68, 0.15)',
  ambulanceGold: '#F59E0B', // Bright warning amber
  onlineGreen: '#10B981',   // Status positive green
  
  // Standard actions
  btnActive: '#2563EB',     // Royal blue
  btnText: '#FFFFFF',
  
  // Overlays
  overlayBg: 'rgba(11, 15, 25, 0.95)',
};

export const THEME = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoUrdu: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.emergencyRed,
    marginRight: 8,
  },
  logoEnglish: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
    letterSpacing: 1,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.cardBorder,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  langButtonText: {
    color: COLORS.textMain,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Offline banner
  offlineBanner: {
    backgroundColor: COLORS.ambulanceGold,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBannerText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Scroll Container
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 10,
  },

  // GPS Coordinates Card
  locationCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  locationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingBottom: 8,
  },
  locationTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  locationStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  locationTextUrdu: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'right',
    marginTop: 2,
  },
  locationTextEn: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 4,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
  },
  coordCol: {
    flex: 1,
  },
  coordLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  coordVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  // Manual Override Button
  overrideBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.textMuted,
  },
  overrideBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  gpsResetBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.btnActive,
  },
  gpsResetBtnText: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '600',
  },

  // Info Disclaimer Box
  disclaimerBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emergencyRed,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textMuted,
  },

  // Sections
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.emergencyRed,
    paddingLeft: 8,
  },
  sectionTitleUrdu: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'right',
    borderRightWidth: 3,
    borderRightColor: COLORS.emergencyRed,
    paddingRight: 8,
  },

  // Loader Box
  loaderBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  loaderText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },

  // Contact list empty state
  emptyBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },

  // Call cards list
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDetails: {
    flex: 1,
    paddingRight: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMain,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  badgeVerified: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: COLORS.onlineGreen,
    borderWidth: 0.5,
    borderColor: COLORS.onlineGreen,
  },
  badgeLive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: COLORS.ambulanceGold,
    borderWidth: 0.5,
    borderColor: COLORS.ambulanceGold,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ambulanceGold,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  cardTitleEn: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 4,
  },
  cardTitleUr: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'right',
    marginTop: 2,
  },
  cardAddress: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  callBtn: {
    backgroundColor: COLORS.emergencyRed,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    height: 50,
  },
  callBtnTextEn: {
    color: COLORS.btnText,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  callBtnTextUr: {
    color: COLORS.btnText,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Modal styling (for manual selection)
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlayBg,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  modalTitleUr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  modalTitleEn: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.textMain,
    fontSize: 14,
    marginBottom: 15,
  },
  districtItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  districtDetails: {
    flex: 1,
  },
  districtNameEn: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  districtProvinceEn: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  districtNameUr: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'right',
  },
  districtProvinceUr: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
});
