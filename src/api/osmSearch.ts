import { EmergencyContact } from '../db/emergencyContacts';
import { calculateDistance } from '../geo/offlineGeocoder';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

interface OverpassElement {
  type: 'node' | 'way';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    'name:ur'?: string;
    'name:en'?: string;
    phone?: string;
    'contact:phone'?: string;
    'emergency:phone'?: string;
    mobile?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    'addr:housenumber'?: string;
    amenity?: string;
    emergency?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * Queries OpenStreetMap Overpass API to fetch active hospitals, clinics, and emergency stations nearby.
 * @param latitude User's current latitude
 * @param longitude User's current longitude
 * @param radiusInMeters Search radius (default 15,000m / 15km)
 */
export const searchNearbyOsmFacilities = async (
  latitude: number,
  longitude: number,
  radiusInMeters = 15000
): Promise<EmergencyContact[]> => {
  // Overpass QL Query looking for hospitals, clinics, and ambulance stations
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radiusInMeters}, ${latitude}, ${longitude});
      way["amenity"="hospital"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["amenity"="clinic"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["emergency"="ambulance_station"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["amenity"="doctors"](around:${radiusInMeters}, ${latitude}, ${longitude});
    );
    out center 30;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API returned status: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    return parseOsmElements(data.elements, latitude, longitude);
  } catch (error) {
    console.error('Error fetching data from Overpass API:', error);
    throw error;
  }
};

/**
 * Parses and maps Overpass elements to the EmergencyContact standard.
 */
const parseOsmElements = (
  elements: OverpassElement[],
  userLat: number,
  userLng: number
): EmergencyContact[] => {
  const contacts: EmergencyContact[] = [];

  for (const element of elements) {
    const tags = element.tags;
    if (!tags) continue;

    // Resolve coordinates (ways return 'center', nodes return 'lat' and 'lon')
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    // Extract name (fallback if name is missing)
    const nameEn = tags['name:en'] || tags.name || (tags.amenity === 'hospital' ? 'Local Hospital' : 'Medical Center');
    const nameUr = tags['name:ur'] || tags.name || (tags.amenity === 'hospital' ? 'مقامی ہسپتال' : 'طبی مرکز');

    // Extract phone number (look across multiple possible OSM tags)
    const rawPhone = tags.phone || tags['contact:phone'] || tags['emergency:phone'] || tags.mobile;
    if (!rawPhone) continue; // In an emergency app, only show facilities with phone numbers

    // Clean phone number (remove spaces, parentheses, etc.)
    const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/[()\-]/g, '');

    // Calculate distance
    const distanceKm = calculateDistance(userLat, userLng, lat, lon);

    // Resolve category
    let categoryEn = 'Hospital';
    let categoryUr = 'ہسپتال';
    if (tags.emergency === 'ambulance_station') {
      categoryEn = 'Ambulance Station';
      categoryUr = 'ایمبولینس اسٹیشن';
    } else if (tags.amenity === 'clinic' || tags.amenity === 'doctors') {
      categoryEn = 'Clinic / Doctor';
      categoryUr = 'کلینک / ڈاکٹر';
    }

    // Build street address
    const street = tags['addr:street'] || '';
    const city = tags['addr:city'] || '';
    const housenumber = tags['addr:housenumber'] || '';
    const addressEn = [housenumber, street, city].filter(Boolean).join(', ') || 'Address not listed';

    contacts.push({
      id: `osm-${element.id}`,
      nameEn,
      nameUr,
      categoryEn,
      categoryUr,
      phone: cleanPhone,
      distanceKm,
      source: 'live_map',
      addressEn,
      addressUr: 'اوپن اسٹریٹ میپ لائیو فیڈ'
    });
  }

  // Sort by distance (closest first)
  return contacts.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
};
