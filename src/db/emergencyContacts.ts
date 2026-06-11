export interface EmergencyContact {
  id: string;
  nameEn: string;
  nameUr: string;
  categoryEn: string;
  categoryUr: string;
  phone: string;
  distanceKm?: number; // Dynamic distance calculation if coordinates match
  districtId?: string; // Mapped district for offline routing
  source: 'offline_database' | 'live_map';
  addressEn?: string;
  addressUr?: string;
}

export const NATIONAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'nat-rescue-1122',
    nameEn: 'Rescue 1122 (State Emergency)',
    nameUr: 'ریسکیو 1122 (سرکاری ایمرجنسی)',
    categoryEn: 'Ambulance & Rescue',
    categoryUr: 'ایمبولینس اور ریسکیو',
    phone: '1122',
    source: 'offline_database',
    addressEn: 'Nationwide Service',
    addressUr: 'ملک گیر سروس'
  },
  {
    id: 'nat-edhi-115',
    nameEn: 'Edhi Ambulance Service',
    nameUr: 'ایدھی ایمبولینس سروس',
    categoryEn: 'Ambulance',
    categoryUr: 'ایمبولینس',
    phone: '115',
    source: 'offline_database',
    addressEn: 'Nationwide Service',
    addressUr: 'ملک گیر سروس'
  },
  {
    id: 'nat-chippa-1020',
    nameEn: 'Chhipa Ambulance',
    nameUr: 'چھیپا ایمبولینس',
    categoryEn: 'Ambulance',
    categoryUr: 'ایمبولینس',
    phone: '1020',
    source: 'offline_database',
    addressEn: 'Nationwide Service',
    addressUr: 'ملک گیر سروس'
  },
  {
    id: 'nat-pehel-911',
    nameEn: 'PEHEL Helpline (National Emergency)',
    nameUr: 'پہل ہیلپ لائن (قومی ایمرجنسی)',
    categoryEn: 'General Emergency',
    categoryUr: 'عام ایمرجنسی',
    phone: '911',
    source: 'offline_database',
    addressEn: 'Nationwide Service',
    addressUr: 'ملک گیر سروس'
  }
];

export const REGIONAL_CONTACTS: EmergencyContact[] = [
  // --- GILGIT-BALTISTAN (Gilgit District) ---
  {
    id: 'gb-dhq-gilgit',
    nameEn: 'DHQ Hospital Gilgit (Emergency ER)',
    nameUr: 'ڈی ایچ کیو ہسپتال گلگت (ایمرجنسی)',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '05811-920210',
    districtId: 'gilgit',
    source: 'offline_database',
    addressEn: 'Hospital Road, Gilgit',
    addressUr: 'ہسپتال روڈ، گلگت'
  },
  {
    id: 'gb-edhi-gilgit',
    nameEn: 'Edhi Ambulance Center Gilgit',
    nameUr: 'ایدھی ایمبولینس سینٹر گلگت',
    categoryEn: 'Ambulance',
    categoryUr: 'ایمبولینس',
    phone: '05811-455115',
    districtId: 'gilgit',
    source: 'offline_database',
    addressEn: 'Jinnah Road, near Airport, Gilgit',
    addressUr: 'جناح روڈ، نزد ائیرپورٹ، گلگت'
  },
  {
    id: 'gb-city-hospital',
    nameEn: 'City Hospital Gilgit',
    nameUr: 'سٹی ہسپتال گلگت',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '05811-920422',
    districtId: 'gilgit',
    source: 'offline_database',
    addressEn: 'Kashrote, Gilgit',
    addressUr: 'کاشروٹ، گلگت'
  },

  // --- PUNJAB (Lahore District) ---
  {
    id: 'pb-mayo-lahore',
    nameEn: 'Mayo Hospital Emergency (Lahore)',
    nameUr: 'میو ہسپتال ایمرجنسی (لاہور)',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '042-99211129',
    districtId: 'lahore',
    source: 'offline_database',
    addressEn: 'Hospital Road, Anarkali, Lahore',
    addressUr: 'ہسپتال روڈ، انارکلی، لاہور'
  },
  {
    id: 'pb-jinnah-lahore',
    nameEn: 'Jinnah Hospital Emergency (Lahore)',
    nameUr: 'جناح ہسپتال ایمرجنسی (لاہور)',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '042-99231400',
    districtId: 'lahore',
    source: 'offline_database',
    addressEn: 'Peco Road, Faisal Town, Lahore',
    addressUr: 'پیکو روڈ، فیصل ٹاؤن، لاہور'
  },
  {
    id: 'pb-edhi-lahore',
    nameEn: 'Edhi Center Lahore HQ',
    nameUr: 'ایدھی سینٹر لاہور ہیڈ کوارٹر',
    categoryEn: 'Ambulance',
    categoryUr: 'ایمبولینس',
    phone: '042-37413300',
    districtId: 'lahore',
    source: 'offline_database',
    addressEn: 'Allama Iqbal Road, Garhi Shahu, Lahore',
    addressUr: 'علامہ اقبال روڈ، گڑھی شاہو، لاہور'
  },

  // --- SINDH (Karachi South District) ---
  {
    id: 'sd-jpmc-karachi',
    nameEn: 'Jinnah Postgraduate ER (JPMC Karachi)',
    nameUr: 'جناح ہسپتال ایمرجنسی (کراچی)',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '021-99201300',
    districtId: 'karachi_south',
    source: 'offline_database',
    addressEn: 'Rafiqui Shaheed Road, Karachi South',
    addressUr: 'رفیقی شہید روڈ، کراچی ساؤتھ'
  },
  {
    id: 'sd-civil-karachi',
    nameEn: 'Dr. Ruth Pfau Civil Hospital ER',
    nameUr: 'سول ہسپتال ایمرجنسی (کراچی)',
    categoryEn: 'Hospital / ER',
    categoryUr: 'ہسپتال / ایمرجنسی وارڈ',
    phone: '021-99215740',
    districtId: 'karachi_south',
    source: 'offline_database',
    addressEn: 'Baba-e-Urdu Road, Saddar, Karachi',
    addressUr: 'بابائے اردو روڈ، صدر، کراچی'
  },
  {
    id: 'sd-chippa-south',
    nameEn: 'Chhipa Ambulance Karachi HQ',
    nameUr: 'چھیپا ایمبولینس کراچی ہیڈ کوارٹر',
    categoryEn: 'Ambulance',
    categoryUr: 'ایمبولینس',
    phone: '021-111921020',
    districtId: 'karachi_south',
    source: 'offline_database',
    addressEn: 'Opposite Karachi Cantonment Station, Karachi',
    addressUr: 'کینٹ اسٹیشن کے سامنے، کراچی'
  }
];

export const DISTRICTS_LIST = [
  { id: 'gilgit', nameEn: 'Gilgit', nameUr: 'گلگت', provinceEn: 'Gilgit-Baltistan', provinceUr: 'گلگت بلتستان' },
  { id: 'lahore', nameEn: 'Lahore', nameUr: 'لاہور', provinceEn: 'Punjab', provinceUr: 'پنجاب' },
  { id: 'karachi_south', nameEn: 'Karachi South', nameUr: 'کراچی ساؤتھ', provinceEn: 'Sindh', provinceUr: 'سندھ' }
];

export const getContactsByDistrict = (districtId: string): EmergencyContact[] => {
  return [
    ...NATIONAL_CONTACTS,
    ...REGIONAL_CONTACTS.filter(contact => contact.districtId === districtId)
  ];
};
