/**
 * FileSaver utility for saving files client-side
 * Wraps FileSaver.js library for consistent file saving
 */

/**
 * Save data as a file using FileSaver.js
 * @param {string|Blob|ArrayBuffer} data - Data to save
 * @param {string} filename - Name of the file to save
 * @param {Object} options - Additional options
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export function saveFile(data, filename, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Convert string data to Blob if necessary
      let blob = data;
      if (typeof data === 'string') {
        blob = new Blob([data], { type: options.type || 'text/plain' });
      }

      // Use FileSaver.js to save the file
      saveAs(blob, filename, options);

      // Resolve after a short delay to ensure file dialog appears
      setTimeout(() => {
        resolve();
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Save JSON data as a .json file
 * @param {Object} data - Object to save as JSON
 * @param {string} filename - Name of the file (without extension)
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export function saveJSON(data, filename) {
  const jsonString = JSON.stringify(data, null, 2);
  return saveFile(jsonString, `${filename}.json`, {
    type: 'application/json',
  });
}

/**
 * Save text content as a file
 * @param {string} text - Text content to save
 * @param {string} filename - Name of the file (without extension)
 * @param {string} extension - File extension (default: .txt)
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export function saveText(text, filename, extension = 'txt') {
  return saveFile(text, `${filename}.${extension}`, {
    type: 'text/plain',
  });
}

/**
 * Save canvas as an image
 * @param {HTMLCanvasElement} canvas - Canvas element to save
 * @param {string} filename - Name of the file (without extension)
 * @param {string} format - Image format ('image/png' or 'image/jpeg')
 * @param {number} quality - Image quality (for JPEG only, 0-1)
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export function saveCanvas(canvas, filename, format = 'image/png', quality = 1.0) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        blob => {
          if (blob) {
            const extension = format === 'image/jpeg' ? 'jpg' : 'png';
            saveFile(blob, `${filename}.${extension}`, { type: format })
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        format,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Save CSV data as a .csv file
 * @param {Array} data - Array of objects to save as CSV
 * @param {string} filename - Name of the file (without extension)
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export function saveCSV(data, filename) {
  if (!Array.isArray(data) || data.length === 0) {
    return Promise.reject(new Error('Data must be a non-empty array'));
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          const stringValue = value === null || value === undefined ? '' : String(value);
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  return saveFile(csvContent, `${filename}.csv`, {
    type: 'text/csv',
  });
}

/**
 * Download a file from a URL
 * @param {string} url - URL to download from
 * @param {string} filename - Name of the file to save
 * @returns {Promise<void>} Promise that resolves when file is saved
 */
export async function downloadFromURL(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return saveFile(blob, filename, {
      type: blob.type,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Check if FileSaver is available
 * @returns {boolean} True if FileSaver.js is loaded
 */
export function isFileSaverAvailable() {
  return typeof saveAs !== 'undefined';
}

/**
 * Get the file size formatted as a human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate a unique filename with timestamp
 * @param {string} baseName - Base name for the file
 * @param {string} extension - File extension (default: .json)
 * @returns {string} Unique filename with timestamp
 */
export function generateTimestampedFilename(baseName, extension = 'json') {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${baseName}-${timestamp}.${extension}`;
}

export default {
  saveFile,
  saveJSON,
  saveText,
  saveCanvas,
  saveCSV,
  downloadFromURL,
  isFileSaverAvailable,
  formatFileSize,
  generateTimestampedFilename,
};
