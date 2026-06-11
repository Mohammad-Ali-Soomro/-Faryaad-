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
    healthcare?: string;
    operator?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * Highly comprehensive Overpass search for all medical, rescue, and ambulance listings.
 * Includes fallback logic to map named organizations (Edhi, Chhipa, Rescue 1122) to their numbers.
 */
export const searchNearbyOsmFacilities = async (
  latitude: number,
  longitude: number,
  radiusInMeters = 12000 // Optimized search radius to 12km to prevent timeouts
): Promise<EmergencyContact[]> => {
  // Optimized Query: narrows nodes/ways by indexed keys first, preventing gateway timeouts
  const query = `
    [out:json][timeout:12];
    (
      node["amenity"~"hospital|clinic|doctors|social_facility|ambulance_station"](around:${radiusInMeters}, ${latitude}, ${longitude});
      way["amenity"~"hospital|clinic"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["emergency"~"ambulance|ambulance_station"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["healthcare"~"hospital|clinic|doctor|centre"](around:${radiusInMeters}, ${latitude}, ${longitude});
      node["amenity"="office"]["name"~"Edhi|Chhipa|Chippa|Alkhidmat|Rescue|Ambulance",i](around:${radiusInMeters}, ${latitude}, ${longitude});
      way["amenity"="office"]["name"~"Edhi|Chhipa|Chippa|Alkhidmat|Rescue|Ambulance",i](around:${radiusInMeters}, ${latitude}, ${longitude});
    );
    out center 35;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'FaryaadEmergencyApp/1.0 (contact: info@faryaad-emergency.pk)',
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
 * Parses and applies heuristics to resolve numbers for facilities without explicit phone tags.
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

    // Extract names
    const rawName = tags.name || '';
    const nameEn = tags['name:en'] || tags.name || (tags.amenity === 'hospital' ? 'Local Hospital' : 'Medical Facility');
    const nameUr = tags['name:ur'] || tags.name || (tags.amenity === 'hospital' ? 'مقامی ہسپتال' : 'طبی مرکز');

    // Extract phone number or apply heuristics based on organization name
    let phone = tags.phone || tags['contact:phone'] || tags['emergency:phone'] || tags.mobile || '';

    // Clean initial phone number if present
    if (phone) {
      phone = phone.replace(/\s+/g, '').replace(/[()\-]/g, '');
    } else {
      // Heuristic: If missing phone tag, check if name matches a major emergency responder network in Pakistan
      const lowerName = rawName.toLowerCase();
      const operator = (tags.operator || '').toLowerCase();
      
      if (lowerName.includes('edhi') || operator.includes('edhi') || lowerName.includes('ایدھی')) {
        phone = '115';
      } else if (
        lowerName.includes('chhipa') || 
        lowerName.includes('chippa') || 
        operator.includes('chhipa') || 
        operator.includes('chippa') ||
        lowerName.includes('چھیپا')
      ) {
        phone = '1020';
      } else if (
        lowerName.includes('rescue') || 
        lowerName.includes('1122') || 
        operator.includes('1122') ||
        lowerName.includes('ریسکیو')
      ) {
        phone = '1122';
      } else if (lowerName.includes('alkhidmat') || lowerName.includes('الخدمت')) {
        phone = '1023';
      } else {
        // Skip generic facilities that have absolutely no phone number listed and do not match major networks
        continue;
      }
    }

    // Calculate distance
    const distanceKm = calculateDistance(userLat, userLng, lat, lon);

    // Resolve category
    let categoryEn = 'Hospital';
    let categoryUr = 'ہسپتال';
    
    const lowerName = rawName.toLowerCase();
    if (tags.emergency === 'ambulance_station' || lowerName.includes('ambulance') || lowerName.includes('ایمبولینس')) {
      categoryEn = 'Ambulance Station';
      categoryUr = 'ایمبولینس اسٹیشن';
    } else if (tags.amenity === 'clinic' || tags.amenity === 'doctors' || lowerName.includes('clinic')) {
      categoryEn = 'Clinic';
      categoryUr = 'کلینک';
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
      phone,
      distanceKm,
      source: 'live_map',
      addressEn,
      addressUr: 'اوپن اسٹریٹ میپ لائیو فیڈ'
    });
  }

  // Deduplicate results with identical names and phone numbers
  const seenKeys = new Set<string>();
  const uniqueContacts: EmergencyContact[] = [];

  for (const c of contacts) {
    const key = `${c.nameEn.toLowerCase()}_${c.phone}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueContacts.push(c);
    }
  }

  // Sort by distance (closest first)
  return uniqueContacts.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
};
