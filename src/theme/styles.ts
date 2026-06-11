import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  background: '#0B0F19', // Deep dark slate
  cardBg: '#151C2C',     // Dark navy card
  cardBorder: '#1F2A3F', // Border color
  textMain: '#F8FAFC',   // Ice white text
  textMuted: '#94A3B8',  // Soft gray text
  
  // Brand / Action colors
  emergencyRed: '#EF4444',  // Solid active distress red
  emergencyRedBg: 'rgba(239, 68, 68, 0.1)',
  ambulanceGold: '#F59E0B', // Warning amber
  ambulanceGoldBg: 'rgba(245, 158, 11, 0.1)',
  onlineGreen: '#10B981',   // Status positive green
  
  btnActive: '#2563EB',     // Royal blue
  btnText: '#FFFFFF',
  overlayBg: 'rgba(11, 15, 25, 0.96)',
};

export const THEME = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textMain,
    letterSpacing: 1.5,
  },
  logoBadge: {
    backgroundColor: COLORS.emergencyRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.cardBorder,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langButtonText: {
    color: COLORS.textMain,
    fontSize: 12,
    fontWeight: '700',
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
  
  // Low-profile Location Banner
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  locationBarText: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  locationChangeLink: {
    color: COLORS.btnActive,
    fontSize: 12,
    fontWeight: '700',
  },

  // Collapsible GPS panel
  coordsPanel: {
    backgroundColor: COLORS.cardBg,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  coordsTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  coordsVal: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '600',
  },
  gpsButtonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  gpsBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  gpsBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Disclaimer Alert Box
  disclaimerBox: {
    backgroundColor: COLORS.emergencyRedBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.emergencyRed,
    fontWeight: '600',
    textAlign: 'center',
  },

  // --- Giant Speed Dial Grid (Top Feature) ---
  speedDialTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  speedDialGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  speedDialCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  speedDialCardRed: {
    backgroundColor: COLORS.emergencyRed,
  },
  speedDialCardGold: {
    backgroundColor: COLORS.ambulanceGold,
  },
  speedDialNumber: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  speedDialLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  speedDialSubLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMain,
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: COLORS.ambulanceGoldBg,
    borderWidth: 0.5,
    borderColor: COLORS.ambulanceGold,
  },
  liveBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.ambulanceGold,
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.ambulanceGold,
  },

  // --- Clean Minimal Dials list ---
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetails: {
    flex: 1,
    paddingRight: 10,
  },
  cardCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMain,
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  cardMetaItem: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardMetaPhone: {
    color: COLORS.ambulanceGold,
    fontWeight: '700',
  },
  callBtn: {
    backgroundColor: COLORS.emergencyRed,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },

  // Loader
  loaderBox: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: COLORS.textMuted,
    fontSize: 14,
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
  districtName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  districtProvince: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
