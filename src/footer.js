/**
 * Keeps the footer copyright years current.
 *
 * Requirement:
 * - Start year is fixed at 2025
 * - End year updates automatically based on the user's current calendar year
 */

const START_YEAR = 2025;

function getYearRangeText(startYear, currentYear) {
    if (!Number.isFinite(startYear) || !Number.isFinite(currentYear)) return '';
    if (currentYear <= startYear) return String(startYear);
    return `${startYear}–${currentYear}`;
}

function updateFooterYears() {
    const el = document.getElementById('copyrightYears');
    if (!el) return;

    const currentYear = new Date().getFullYear();
    el.textContent = getYearRangeText(START_YEAR, currentYear);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFooterYears);
} else {
    updateFooterYears();
}
