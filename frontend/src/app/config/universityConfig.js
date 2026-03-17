/**
 * University Email Validation & Universities Configuration
 * 
 * Centralized configuration for:
 * - Allowed university email domains
 * - Lebanese universities list
 * - Email-to-university mapping for validation
 */

// ============================================================
// ALLOWED EMAIL DOMAINS
// ============================================================

/**
 * List of allowed university email domains
 * Used for validating student emails during signup
 */
export const ALLOWED_EMAIL_DOMAINS = [
  // Lebanese Universities - General
  '.edu.lb',              // All Lebanese universities with .edu.lb

  // Lebanese Universities - Specific Domains
  '@aub.edu.lb',          // American University of Beirut (AUB)
  '@lau.edu',             // Lebanese American University (LAU) - NO .lb suffix!
  '@usj.edu.lb',          // Université Saint-Joseph (USJ)
  '@ul.edu.lb',           // Lebanese University
  '@std.balamand.edu.lb', // University of Balamand
  '@balamand.edu.lb',     // University of Balamand (alternative)
  '@ndu.edu.lb',          // Notre Dame University - Louaize (NDU)
  '@haigazian.edu.lb',    // Haigazian University
  '@jinan.edu.lb',        // Jinan University
  '@aust.edu.lb',         // American University of Science and Technology
  '@bau.edu.lb',          // Beirut Arab University
  '@liu.edu.lb',          // Lebanese International University
  '@mubs.edu.lb',         // Modern University for Business and Science
  '@rhu.edu.lb',          // Rafik Hariri University
  '@gu.edu.lb',           // Global University
  '@mu.edu.lb',           // Al Maaref University
  '@arts.edu.lb',         // Lebanese Academy of Fine Arts (ALBA)
  '@usek.edu.lb',         // Holy Spirit University of Kaslik (USEK)
  '@ua.edu.lb',           // Antonine University (UA)
  '@aul.edu.lb',          // Arts, Sciences and Technology University (AUL)

  // // International universities (optional - remove if you want Lebanon-only)
  // '.edu',        // US universities
  // '.ac.uk',      // UK universities
  // '.edu.au',     // Australian universities
  // '.ac.nz',      // New Zealand universities
  // '.edu.sg',     // Singapore universities
  // '.ac.in',      // Indian universities
  // '.edu.pk',     // Pakistani universities
];

// ============================================================
// EMAIL TO UNIVERSITY MAPPING
// ============================================================

/**
 * Mapping of email domains to university names
 * Used to validate that selected university matches email domain
 * Only includes major universities with specific domains
 */
export const EMAIL_UNIVERSITY_MAP = {
  '@aub.edu.lb': 'American University of Beirut (AUB)',
  '@lau.edu': 'Lebanese American University (LAU)',
  '@usj.edu.lb': 'Université Saint-Joseph (USJ)',
  '@ul.edu.lb': 'Lebanese University (LU)',
  '@std.balamand.edu.lb': 'University of Balamand',
  '@balamand.edu.lb': 'University of Balamand',
  '@ndu.edu.lb': 'Notre Dame University (NDU) - Louaize',
  '@haigazian.edu.lb': 'Haigazian University',
  '@jinan.edu.lb': 'Jinan University',
  '@aust.edu.lb': 'American University of Science and Technology (AUST)',
  '@bau.edu.lb': 'Beirut Arab University (BAU)',
  '@liu.edu.lb': 'Lebanese International University (LIU)',
  '@mubs.edu.lb': 'Modern University for Business and Science (MUBS)',
  '@rhu.edu.lb': 'Rafik Hariri University (RHU)',
  '@gu.edu.lb': 'Global University',
  '@mu.edu.lb': 'Al Maaref University',
  '@arts.edu.lb': 'Lebanese Academy of Fine Arts (ALBA)',
  '@usek.edu.lb': 'Holy Spirit University of Kaslik (USEK)',
  '@ua.edu.lb': 'Antonine University (UA)',
  '@aul.edu.lb': 'Arts, Sciences and Technology University (AUL)',
};

// ============================================================
// UNIVERSITIES LIST
// ============================================================

/**
 * Complete list of Lebanese universities
 * Used in signup form dropdown
 */
export const UNIVERSITIES_LIST = [
  // Lebanese Universities
  { name: 'American University of Beirut (AUB)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Lebanese American University (LAU) - Beirut', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Lebanese American University (LAU) - Byblos', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Université Saint-Joseph (USJ)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Lebanese University (LU) - Hadath', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'University of Balamand', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Notre Dame University (NDU) - Louaize', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Haigazian University', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Jinan University', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'American University of Science and Technology (AUST)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Beirut Arab University (BAU)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Lebanese International University (LIU) - Beirut', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Modern University for Business and Science (MUBS)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Rafik Hariri University (RHU)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Global University', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Al Maaref University', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Lebanese Academy of Fine Arts (ALBA)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Antonine University (UA)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Holy Spirit University of Kaslik (USEK)', country: 'Lebanon', group: 'Lebanese Universities' },
  { name: 'Arts, Sciences and Technology University (AUL)', country: 'Lebanon', group: 'Lebanese Universities' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Group universities by category for organized dropdown display
 * @returns {Object} Object with university groups as keys and arrays of universities as values
 */
export const getGroupedUniversities = () => {
  return UNIVERSITIES_LIST.reduce((acc, uni) => {
    if (!acc[uni.group]) {
      acc[uni.group] = [];
    }
    acc[uni.group].push(uni);
    return acc;
  }, {});
};

/**
 * Validate if an email matches allowed university domains
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email matches an allowed domain
 */
export const isValidUniversityEmail = (email) => {
  const emailLower = email.toLowerCase().trim();
  return ALLOWED_EMAIL_DOMAINS.some(domain => emailLower.endsWith(domain));
};