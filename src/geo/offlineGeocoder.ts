export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface DistrictGeofence {
  id: string;
  nameEn: string;
  nameUr: string;
  provinceEn: string;
  provinceUr: string;
  // Bounding box: [minLat, maxLat, minLng, maxLng]
  bounds: [number, number, number, number];
}

// Seed coordinate bounding boxes for validation
export const DISTRICT_GEOFENCES: DistrictGeofence[] = [
  {
    id: 'gilgit',
    nameEn: 'Gilgit District',
    nameUr: 'ضلع گلگت',
    provinceEn: 'Gilgit-Baltistan',
    provinceUr: 'گلگت بلتستان',
    bounds: [35.80, 36.20, 74.15, 74.45] // Approx boundaries of Gilgit and immediate areas
  },
  {
    id: 'lahore',
    nameEn: 'Lahore District',
    nameUr: 'ضلع لاہور',
    provinceEn: 'Punjab',
    provinceUr: 'پنجاب',
    bounds: [31.30, 31.65, 74.10, 74.55] // Approx boundaries of Lahore
  },
  {
    id: 'karachi_south',
    nameEn: 'Karachi South',
    nameUr: 'کراچی ساؤتھ',
    provinceEn: 'Sindh',
    provinceUr: 'سندھ',
    bounds: [24.75, 24.92, 66.90, 67.15] // Approx boundaries of Karachi South / Saddar / Cantonment
  }
];

/**
 * Resolves coordinate to district using offline bounding boxes.
 */
export const resolveDistrictOffline = (latitude: number, longitude: number): DistrictGeofence | null => {
  for (const geofence of DISTRICT_GEOFENCES) {
    const [minLat, maxLat, minLng, maxLng] = geofence.bounds;
    if (latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng) {
      return geofence;
    }
  }
  return null;
};

/**
 * Calculates distance in kilometers between two GPS points using the Haversine formula.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1)); // return with 1 decimal precision
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
