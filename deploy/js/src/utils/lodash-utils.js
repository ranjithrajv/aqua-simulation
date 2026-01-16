/**
 * Lodash utilities for data manipulation
 */

/**
 * Debounce a function using lodash
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @param {Object} options - Debounce options
 * @returns {Function} Debounced function
 */
export function debounceFunction(func, wait, options) {
  return _.debounce(func, wait, options);
}

/**
 * Throttle a function using lodash
 * @param {Function} func - Function to throttle
 * @param {number} wait - Time to wait in milliseconds
 * @param {Object} options - Throttle options
 * @returns {Function} Throttled function
 */
export function throttleFunction(func, wait, options) {
  return _.throttle(func, wait, options);
}

/**
 * Deep clone an object using lodash
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return _.cloneDeep(obj);
}

/**
 * Remove duplicates from an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to determine uniqueness
 * @returns {Array} Array with duplicates removed
 */
export function removeDuplicates(arr, iteratee) {
  return _.uniqBy(arr, iteratee);
}

/**
 * Sort an array using a property
 * @param {Array} arr - Array to sort
 * @param {string|Function} iteratee - Property name or function to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortArray(arr, iteratee, order = 'asc') {
  const sorted = _.sortBy(arr, iteratee);
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Group an array by a property
 * @param {Array} arr - Array to group
 * @param {string|Function} iteratee - Property name or function to group by
 * @returns {Object} Grouped object
 */
export function groupArray(arr, iteratee) {
  return _.groupBy(arr, iteratee);
}

/**
 * Sum values in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to sum
 * @returns {number} Sum of values
 */
export function sumArray(arr, iteratee) {
  return _.sumBy(arr, iteratee);
}

/**
 * Find maximum value in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to compare
 * @returns {*} Maximum value
 */
export function maxArray(arr, iteratee) {
  return _.maxBy(arr, iteratee);
}

/**
 * Find minimum value in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to compare
 * @returns {*} Minimum value
 */
export function minArray(arr, iteratee) {
  return _.minBy(arr, iteratee);
}

/**
 * Filter an array using a predicate
 * @param {Array} arr - Array to filter
 * @param {Function} predicate - Function to test each element
 * @returns {Array} Filtered array
 */
export function filterArray(arr, predicate) {
  return _.filter(arr, predicate);
}

/**
 * Map an array to a new array using a function
 * @param {Array} arr - Array to map
 * @param {Function} iteratee - Function to transform each element
 * @returns {Array} Mapped array
 */
export function mapArray(arr, iteratee) {
  return _.map(arr, iteratee);
}

/**
 * Reduce an array to a single value
 * @param {Array} arr - Array to reduce
 * @param {Function} iteratee - Function to execute on each element
 * @param {*} initialValue - Initial value for accumulator
 * @returns {*} Reduced value
 */
export function reduceArray(arr, iteratee, initialValue) {
  return _.reduce(arr, iteratee, initialValue);
}

/**
 * Create a memoized version of a function
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Function to resolve cache key
 * @returns {Function} Memoized function
 */
export function memoizeFunction(func, resolver) {
  return _.memoize(func, resolver);
}

/**
 * Check if a value is equal to another value
 * @param {*} value - First value
 * @param {*} other - Second value
 * @returns {boolean} True if values are equal
 */
export function isEqual(value, other) {
  return _.isEqual(value, other);
}

/**
 * Get the difference between two arrays
 * @param {Array} array - First array
 * @param {Array} values - Values to exclude
 * @returns {Array} Difference array
 */
export function difference(array, values) {
  return _.difference(array, values);
}

/**
 * Flatten a nested array
 * @param {Array} array - Array to flatten
 * @returns {Array} Flattened array
 */
export function flattenArray(array) {
  return _.flatten(array);
}

/**
 * Clamp a number between min and max values
 * @param {number} number - The number to clamp
 * @param {number} lower - The lower bound
 * @param {number} upper - The upper bound
 * @returns {number} Clamped number
 */
export function clamp(number, lower, upper) {
  return _.clamp(number, lower, upper);
}

/**
 * Get object values as an array
 * @param {Object} obj - Object to get values from
 * @returns {Array} Array of values
 */
export function getValues(obj) {
  return _.values(obj);
}

/**
 * Get object keys as an array
 * @param {Object} obj - Object to get keys from
 * @returns {Array} Array of keys
 */
export function getKeys(obj) {
  return _.keys(obj);
}

/**
 * Order an array by properties
 * @param {Array} arr - Array to order
 * @param {string[]|Function[]} iteratees - Property names or functions to order by
 * @param {string[]} orders - Sort orders ('asc' or 'desc')
 * @returns {Array} Ordered array
 */
export function orderBy(arr, iteratees, orders) {
  return _.orderBy(arr, iteratees, orders);
}

/**
 * Find the maximum value in an array
 * @param {Array} arr - Array to process
 * @returns {*} Maximum value
 */
export function max(arr) {
  return _.max(arr);
}

/**
 * Find the minimum value in an array
 * @param {Array} arr - Array to process
 * @returns {*} Minimum value
 */
export function min(arr) {
  return _.min(arr);
}

/**
 * Chunk an array into smaller arrays
 * @param {Array} arr - Array to chunk
 * @param {number} size - Size of each chunk
 * @returns {Array} Chunked arrays
 */
export function chunk(arr, size) {
  return _.chunk(arr, size);
}

/**
 * Throttle a function using lodash
 * @param {Function} func - Function to throttle
 * @param {number} wait - Time to wait in milliseconds
 * @param {Object} options - Throttle options
  return throttle(func, wait, options);
}

/**
 * Deep clone an object using lodash
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return cloneDeep(obj);
}

/**
 * Remove duplicates from an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to determine uniqueness
 * @returns {Array} Array with duplicates removed
 */
export function removeDuplicates(arr, iteratee) {
  return uniqBy(arr, iteratee);
}

/**
 * Sort an array using a property
 * @param {Array} arr - Array to sort
 * @param {string|Function} iteratee - Property name or function to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortArray(arr, iteratee, order = 'asc') {
  const sorted = sortBy(arr, iteratee);
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Group an array by a property
 * @param {Array} arr - Array to group
 * @param {string|Function} iteratee - Property name or function to group by
 * @returns {Object} Grouped object
 */
export function groupArray(arr, iteratee) {
  return groupBy(arr, iteratee);
}

/**
 * Sum values in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to sum
 * @returns {number} Sum of values
 */
export function sumArray(arr, iteratee) {
  return sumBy(arr, iteratee);
}

/**
 * Find the maximum value in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to compare
 * @returns {*} Maximum value
 */
export function maxArray(arr, iteratee) {
  return maxBy(arr, iteratee);
}

/**
 * Find the minimum value in an array based on a property
 * @param {Array} arr - Array to process
 * @param {string|Function} iteratee - Property name or function to compare
 * @returns {*} Minimum value
 */
export function minArray(arr, iteratee) {
  return minBy(arr, iteratee);
}

/**
 * Filter an array using a predicate
 * @param {Array} arr - Array to filter
 * @param {Function} predicate - Function to test each element
 * @returns {Array} Filtered array
 */
export function filterArray(arr, predicate) {
  return filter(arr, predicate);
}

/**
 * Map an array to a new array using a function
 * @param {Array} arr - Array to map
 * @param {Function} iteratee - Function to transform each element
 * @returns {Array} Mapped array
 */
export function mapArray(arr, iteratee) {
  return map(arr, iteratee);
}

/**
 * Reduce an array to a single value
 * @param {Array} arr - Array to reduce
 * @param {Function} iteratee - Function to execute on each element
 * @param {*} initialValue - Initial value for the accumulator
 * @returns {*} Reduced value
 */
export function reduceArray(arr, iteratee, initialValue) {
  return reduce(arr, iteratee, initialValue);
}

/**
 * Create a memoized version of a function
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Function to resolve cache key
 * @returns {Function} Memoized function
 */
export function memoizeFunction(func, resolver) {
  return _.memoize(func, resolver);
}

/**
 * Check if a value is equal to another value
 * @param {*} value - First value
 * @param {*} other - Second value
 * @returns {boolean} True if values are equal
 */
export function isEqual(value, other) {
  return _.isEqual(value, other);
}

/**
 * Get the difference between two arrays
 * @param {Array} array - First array
 * @param {Array} values - Values to exclude
 * @returns {Array} Difference array
 */
export function difference(array, values) {
  return _.difference(array, values);
}

/**
 * Flatten a nested array
 * @param {Array} array - Array to flatten
 * @returns {Array} Flattened array
 */
export function flattenArray(array) {
  return _.flatten(array);
}
