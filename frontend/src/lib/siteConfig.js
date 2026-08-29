// Auto-updating site configuration
// These values update automatically every year without manual changes.

/**
 * Returns the current academic year in Indian format (e.g. "2026-27").
 * Indian academic year runs July → June, so:
 *   - July 2026 to June 2027 → "2026-27"
 *   - January 2027 to June 2027 → "2026-27"
 *   - July 2027 to June 2028 → "2027-28"
 */
export function getAcademicYear() {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (6 = July)
  const year = now.getFullYear();

  if (month >= 6) {
    // July (6) through December (11): year-year+1
    return `${year}-${String(year + 1).slice(-2)}`;
  }
  // January (0) through June (5): year-1-year
  return `${year - 1}-${String(year).slice(-2)}`;
}

/**
 * Returns the full academic year display (e.g. "2026-2027").
 */
export function getAcademicYearFull() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month >= 6) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Returns number of years since college establishment.
 * College was established in 1983.
 * Current year 2026 → 43 years.
 */
export function getCollegeYears() {
  return new Date().getFullYear() - 1983;
}

/**
 * Returns the current copyright year.
 */
export function getCopyrightYear() {
  return new Date().getFullYear();
}

/**
 * Default office hours displayed across the site.
 */
export const OFFICE_HOURS = 'Monday – Saturday, 10:30 AM – 5:00 PM';
