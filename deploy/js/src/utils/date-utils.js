/**
 * Date utilities using date-fns
 */
// date-fns is loaded via CDN in index.html, using global dateFns object
const df = (typeof window !== 'undefined' && window.dateFns) ? window.dateFns : globalThis.dateFns;

// Define functions based on whether dateFns is available
const format = df?.format || ((date, formatStr) => {
    // Simple fallback formatter
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString(); // Basic fallback
});

const parseISO = df?.parseISO || ((str) => new Date(str));

const addDays = df?.addDays || ((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
});

const isAfter = df?.isAfter || ((date1, date2) => new Date(date1) > new Date(date2));

const isBefore = df?.isBefore || ((date1, date2) => new Date(date1) < new Date(date2));

const differenceInDays = df?.differenceInDays || ((date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
});

const isValid = df?.isValid || ((date) => {
    try {
        return date instanceof Date && !isNaN(date);
    } catch {
        return false;
    }
});

/**
 * Format a date in a human-readable format
 * @param {Date|string} date - Date to format
 * @param {string} dateFormat - Format string (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns {string} Formatted date string
 */
export function formatDate(date, dateFormat = 'yyyy-MM-dd HH:mm:ss') {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            throw new Error('Invalid date');
        }
        return format(dateObj, dateFormat);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Calculate days between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days between dates
 */
export function daysBetween(startDate, endDate) {
    try {
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
        const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
        
        if (!isValid(start) || !isValid(end)) {
            throw new Error('Invalid date(s)');
        }
        
        return differenceInDays(end, start);
    } catch (error) {
        console.error('Error calculating days between dates:', error);
        return 0;
    }
}

/**
 * Add days to a date
 * @param {Date|string} date - Date to add days to
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export function addDaysToDate(date, days) {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            throw new Error('Invalid date');
        }
        return addDays(dateObj, days);
    } catch (error) {
        console.error('Error adding days to date:', error);
        return new Date();
    }
}

/**
 * Validate if a date is in the past
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if date is in the past
 */
export function isDateInPast(date) {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            throw new Error('Invalid date');
        }
        return isBefore(dateObj, new Date());
    } catch (error) {
        console.error('Error validating date:', error);
        return false;
    }
}

/**
 * Validate if a date is in the future
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if date is in the future
 */
export function isDateInFuture(date) {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            throw new Error('Invalid date');
        }
        return isAfter(dateObj, new Date());
    } catch (error) {
        console.error('Error validating date:', error);
        return false;
    }
}