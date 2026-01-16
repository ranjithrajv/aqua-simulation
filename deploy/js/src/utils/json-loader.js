/**
 * Utility functions for loading JSON data with fallback
 */

/**
 * Loads JSON data from a URL with fallback to default values
 * @param {string} url - The URL to fetch JSON data from
 * @param {object} defaultData - The default data to use if fetch fails
 * @param {string} dataType - The name of the data type for logging
 * @returns {Promise<object>} The loaded JSON data
 */
export async function loadJSONData(url, defaultData, dataType) {
    // Check if we're in a browser environment (has window and fetch)
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`${dataType} loaded successfully from JSON`);
            return data;
        } catch (error) {
            console.error(`Failed to load ${dataType} from JSON:`, error);
            console.log(`Using default ${dataType}`);
            return defaultData;
        }
    } else {
        // For Node.js environment, we'll return default data
        console.log(`Running in Node.js environment, using default ${dataType}`);
        return defaultData;
    }
}

/**
 * Loads JSON data synchronously using the fetch API with a callback pattern
 * @param {string} url - The URL to fetch JSON data from
 * @param {object} defaultData - The default data to use if fetch fails
 * @param {string} dataType - The name of the data type for logging
 * @param {function} callback - The callback function to handle loaded data
 */
export function loadJSONDataSync(url, defaultData, dataType, callback) {
    // Check if we're in a browser environment (has window and fetch)
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`${dataType} loaded successfully from JSON`);
                callback(data);
            })
            .catch(error => {
                console.error(`Failed to load ${dataType} from JSON:`, error);
                console.log(`Using default ${dataType}`);
                callback(defaultData);
            });
    } else {
        // For Node.js environment, we'll use default data
        console.log(`Running in Node.js environment, using default ${dataType}`);
        callback(defaultData);
    }
}