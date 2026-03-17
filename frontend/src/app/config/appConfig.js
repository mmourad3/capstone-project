/**
 * UniMate Application Configuration
 * 
 * Centralized configuration for managing country availability,
 * feature flags, and other app-wide settings.
 */

// ============================================================
// COUNTRY AVAILABILITY CONFIGURATION
// ============================================================

/**
 * Set to true to enable multi-country LOCATION support
 * Set to false to restrict LOCATIONS to Lebanon only
 * 
 * IMPORTANT: This only controls WHERE dorms/listings can be located.
 * Students can still select ANY country for their phone number!
 * 
 * Example Use Case:
 * - Student from Saudi Arabia (+966) can attend Lebanese universities
 * - They select "Saudi Arabia" for phone validation
 * - But all dorm listings MUST be in Lebanon (LB)
 * 
 * When false:
 * - Location searches restricted to Lebanon only
 * - All dorm/carpool listings must be in Lebanon
 * - Phone numbers can be from any country
 * 
 * When true:
 * - Location searches respect listing's country
 * - Dorm/carpool listings can be in multiple countries
 * - Each listing tagged with its country
 */
export const ENABLE_MULTI_COUNTRY = false;

/**
 * Default country for new signups
 * This is used to pre-select the country during signup
 */
export const DEFAULT_COUNTRY = {
  name: 'Lebanon',
  code: '+961',
  iso: 'LB',
  flag: '🇱🇧'
};

/**
 * List of available countries
 * Add more countries here when expanding internationally
 */
export const AVAILABLE_COUNTRIES = [
  { name: 'Lebanon', code: '+961', iso: 'LB', flag: '🇱🇧', phoneFormat: '(XX) XXX XXX', minDigits: 8, maxDigits: 8 },
  // Additional countries (enabled when ENABLE_MULTI_COUNTRY = true)
  { name: 'United States', code: '+1', iso: 'US', flag: '🇺🇸', phoneFormat: '(XXX) XXX-XXXX', minDigits: 10, maxDigits: 10 },
  { name: 'United Kingdom', code: '+44', iso: 'GB', flag: '🇬🇧', phoneFormat: 'XXXX XXX XXX', minDigits: 10, maxDigits: 10 },
  { name: 'Canada', code: '+1', iso: 'CA', flag: '🇨🇦', phoneFormat: '(XXX) XXX-XXXX', minDigits: 10, maxDigits: 10 },
  { name: 'Australia', code: '+61', iso: 'AU', flag: '🇦🇺', phoneFormat: 'XXX XXX XXX', minDigits: 9, maxDigits: 9 },
  { name: 'India', code: '+91', iso: 'IN', flag: '🇮🇳', phoneFormat: 'XXXXX XXXXX', minDigits: 10, maxDigits: 10 },
  { name: 'Pakistan', code: '+92', iso: 'PK', flag: '🇵🇰', phoneFormat: 'XXX XXXXXXX', minDigits: 10, maxDigits: 10 },
  { name: 'United Arab Emirates', code: '+971', iso: 'AE', flag: '🇦🇪', phoneFormat: 'XX XXX XXXX', minDigits: 9, maxDigits: 9 },
  { name: 'Saudi Arabia', code: '+966', iso: 'SA', flag: '🇸🇦', phoneFormat: 'XX XXX XXXX', minDigits: 9, maxDigits: 9 },
  { name: 'Egypt', code: '+20', iso: 'EG', flag: '🇪🇬', phoneFormat: 'XXX XXX XXXX', minDigits: 10, maxDigits: 10 },
  { name: 'Jordan', code: '+962', iso: 'JO', flag: '🇯🇴', phoneFormat: 'X XXXX XXXX', minDigits: 9, maxDigits: 9 },
  { name: 'Turkey', code: '+90', iso: 'TR', flag: '🇹🇷', phoneFormat: 'XXX XXX XX XX', minDigits: 10, maxDigits: 10 },
  { name: 'France', code: '+33', iso: 'FR', flag: '🇫🇷', phoneFormat: 'X XX XX XX XX', minDigits: 9, maxDigits: 9 },
  { name: 'Germany', code: '+49', iso: 'DE', flag: '🇩🇪', phoneFormat: 'XXX XXXXXXX', minDigits: 10, maxDigits: 11 },
  { name: 'Singapore', code: '+65', iso: 'SG', flag: '🇸🇬', phoneFormat: 'XXXX XXXX', minDigits: 8, maxDigits: 8 },
];

/**
 * Get the list of countries available based on configuration
 * @returns {Array} Array of country objects
 */
export const getAvailableCountries = () => {
  // ALWAYS return all countries for phone number selection
  // International students can have phone numbers from any country
  return AVAILABLE_COUNTRIES;
};

/**
 * Get the country ISO code for location searches
 * This is separate from phone number country selection
 * @returns {string} 2-letter ISO country code for location filtering
 */
export const getLocationCountryISO = () => {
  if (ENABLE_MULTI_COUNTRY) {
    // In multi-country mode, each listing has its own country
    return null; // Don't filter by country
  }
  // Lebanon-only mode: all locations must be in Lebanon
  return 'LB';
};

/**
 * Get the user's country ISO code, defaulting to Lebanon if not set
 * @param {string} storedCountryCode - The country code from localStorage
 * @returns {string} 2-letter ISO country code
 */
export const getUserCountryISO = (storedCountryCode) => {
  if (!ENABLE_MULTI_COUNTRY) {
    return 'LB'; // Force Lebanon in Lebanon-only mode
  }
  return storedCountryCode || DEFAULT_COUNTRY.iso;
};

// ============================================================
// LEBANESE REGIONS/CITIES CONFIGURATION
// ============================================================

/**
 * List of Lebanese regions/cities for carpool pickup locations
 * Organized by major regions
 */
export const LEBANESE_REGIONS = [
  // Beirut
  { name: 'Beirut - Hamra', region: 'Beirut' },
  { name: 'Beirut - Achrafieh', region: 'Beirut' },
  { name: 'Beirut - Verdun', region: 'Beirut' },
  { name: 'Beirut - Ras Beirut', region: 'Beirut' },
  { name: 'Beirut - Mar Mikhael', region: 'Beirut' },
  { name: 'Beirut - Downtown', region: 'Beirut' },
  
  // Mount Lebanon - North
  { name: 'Jounieh', region: 'Mount Lebanon' },
  { name: 'Byblos (Jbeil)', region: 'Mount Lebanon' },
  { name: 'Dbayeh', region: 'Mount Lebanon' },
  { name: 'Kaslik', region: 'Mount Lebanon' },
  { name: 'Zouk Mosbeh', region: 'Mount Lebanon' },
  { name: 'Jal el Dib', region: 'Mount Lebanon' },
  
  // Mount Lebanon - East
  { name: 'Baabda', region: 'Mount Lebanon' },
  { name: 'Hazmieh', region: 'Mount Lebanon' },
  { name: 'Sin el Fil', region: 'Mount Lebanon' },
  { name: 'Mansourieh', region: 'Mount Lebanon' },
  
  // Mount Lebanon - South
  { name: 'Chouf - Beiteddine', region: 'Mount Lebanon' },
  { name: 'Aley', region: 'Mount Lebanon' },
  { name: 'Souk El Gharb', region: 'Mount Lebanon' },
  
  // South Lebanon
  { name: 'Sidon (Saida)', region: 'South Lebanon' },
  { name: 'Tyre (Sour)', region: 'South Lebanon' },
  { name: 'Nabatieh', region: 'South Lebanon' },
  { name: 'Jezzine', region: 'South Lebanon' },
  
  // North Lebanon
  { name: 'Tripoli', region: 'North Lebanon' },
  { name: 'Zgharta', region: 'North Lebanon' },
  { name: 'Batroun', region: 'North Lebanon' },
  { name: 'Koura', region: 'North Lebanon' },
  { name: 'Bcharreh', region: 'North Lebanon' },
  
  // Bekaa Valley
  { name: 'Zahle', region: 'Bekaa' },
  { name: 'Baalbek', region: 'Bekaa' },
  { name: 'Chtaura', region: 'Bekaa' },
  { name: 'Rayak', region: 'Bekaa' },
  { name: 'Anjar', region: 'Bekaa' },
];

/**
 * Get grouped regions for display in dropdowns
 */
export const getGroupedRegions = () => {
  const grouped = {};
  LEBANESE_REGIONS.forEach(location => {
    if (!grouped[location.region]) {
      grouped[location.region] = [];
    }
    grouped[location.region].push(location);
  });
  return grouped;
};

// ============================================================
// FEATURE FLAGS
// ============================================================

/**
 * Feature flags for toggling functionality
 */
export const FEATURES = {
  // Enable/disable AI compatibility matching
  AI_COMPATIBILITY: true,
  
  // Enable/disable carpool feature
  CARPOOL: true,
  
  // Enable/disable dorm provider feature
  DORM_PROVIDER: true,
  
  // Enable/disable dorm seeker feature
  DORM_SEEKER: true,
};

// ============================================================
// APP METADATA
// ============================================================

export const APP_INFO = {
  name: 'UniMate',
  version: '1.0.0',
  description: 'University student roommate and carpool platform',
  supportEmail: 'support@unimate.edu.lb',
};

// ============================================================
// API CONFIGURATION
// ============================================================

/**
 * Backend API URL
 * Note: Backend is currently disabled - app uses localStorage for all data
 */
export const API_BASE_URL = 'http://localhost:5000';

/**
 * API refresh interval for real-time updates (in milliseconds)
 * Default: 5000ms (5 seconds)
 */
export const API_REFRESH_INTERVAL = 5000;