// Reverse calculator: Find dimensions for a target volume
export class DimensionFinder {
    constructor() {
        this.minDimension = 10; // Minimum dimension in inches
        this.maxDimension = 120; // Maximum dimension in inches
        this.tolerancePercent = 0.1; // 10% tolerance for volume matching
    }

    /**
     * Find dimension combinations for a target volume
     * @param {number} targetVolumeGallons - Target volume in gallons
     * @param {object} constraints - Optional constraints (maxWidth, maxLength, maxHeight)
     * @param {number} maxResults - Maximum number of results to return (default: 10)
     * @returns {Array} Array of dimension objects sorted by closeness to target volume
     */
    findDimensions(targetVolumeGallons, constraints = {}, maxResults = 10) {
        const targetLiters = targetVolumeGallons / 0.264172; // Convert to liters for calculation
        const results = [];

        const maxWidth = constraints.maxWidth || this.maxDimension;
        const maxLength = constraints.maxLength || this.maxDimension;
        const maxHeight = constraints.maxHeight || 60; // Default max height 60 inches

        // Iterate through reasonable dimension ranges
        const widthRange = this.getDimensionRange(this.minDimension, maxWidth);
        const lengthRange = this.getDimensionRange(this.minDimension, maxLength);
        const heightRange = this.getDimensionRange(12, maxHeight); // Minimum 12 inches height

        for (const width of widthRange) {
            for (const length of lengthRange) {
                for (const height of heightRange) {
                    const volume = this.calculateVolume(length, width, height);
                    const volumeGallons = volume * 0.264172;

                    const difference = Math.abs(volumeGallons - targetVolumeGallons);
                    const percentDifference = (difference / targetVolumeGallons) * 100;

                    if (percentDifference <= this.tolerancePercent * 100) {
                        results.push({
                            width: Math.round(width),
                            length: Math.round(length),
                            height: Math.round(height),
                            volumeGallons: volumeGallons.toFixed(1),
                            percentDifference: percentDifference.toFixed(1),
                            aspectRatio: this.getAspectRatio(length, width, height),
                            footprint: Math.round(length * width),
                            depth: Math.round(height)
                        });
                    }
                }
            }
        }

        // Sort by how close they are to target volume
        results.sort((a, b) => {
            return parseFloat(a.percentDifference) - parseFloat(b.percentDifference);
        });

        // Return unique results (avoid duplicates)
        return this.getUniqueResults(results, maxResults);
    }

    /**
     * Get dimension range with reasonable step sizes
     * @param {number} min - Minimum dimension
     * @param {number} max - Maximum dimension
     * @returns {Array} Array of dimension values
     */
    getDimensionRange(min, max) {
        const range = [];
        let current = min;

        while (current <= max) {
            range.push(current);
            // Use larger step sizes for larger dimensions
            if (current < 24) {
                current += 2;
            } else if (current < 48) {
                current += 4;
            } else {
                current += 6;
            }
        }

        return range;
    }

    /**
     * Calculate volume in liters from dimensions (inches)
     * @param {number} length - Length in inches
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @returns {number} Volume in liters
     */
    calculateVolume(length, width, height) {
        // Convert inches to cm
        const lengthCm = length * 2.54;
        const widthCm = width * 2.54;
        const heightCm = height * 2.54;

        // Volume in cm³
        const volumeCm3 = lengthCm * widthCm * heightCm;

        // Convert to liters
        return volumeCm3 / 1000;
    }

    /**
     * Get aspect ratio description
     * @param {number} length - Length in inches
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @returns {string} Aspect ratio description
     */
    getAspectRatio(length, width, height) {
        const lwRatio = (length / width).toFixed(1);
        const lhRatio = (length / height).toFixed(1);

        if (length > width * 2) {
            return `Wide (${lwRatio}:1 L:W)`;
        } else if (width > length * 1.5) {
            return `Deep (${(width / length).toFixed(1)}:1 W:L)`;
        } else if (height > length * 0.8) {
            return `Tall (${lhRatio}:1 L:H)`;
        } else if (length > height * 2) {
            return `Long (${lhRatio}:1 L:H)`;
        } else {
            return `Standard (${lwRatio}:1 L:W)`;
        }
    }

    /**
     * Remove duplicate or very similar results
     * @param {Array} results - Array of results
     * @param {number} maxResults - Maximum results to return
     * @returns {Array} Unique results
     */
    getUniqueResults(results, maxResults) {
        const unique = [];
        const seen = new Set();

        for (const result of results) {
            const key = `${result.width}x${result.length}x${result.height}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(result);

                if (unique.length >= maxResults) {
                    break;
                }
            }
        }

        return unique;
    }

    /**
     * Get category for tank size
     * @param {number} volumeGallons - Volume in gallons
     * @returns {string} Category name
     */
    getCategory(volumeGallons) {
        if (volumeGallons <= 20) return 'Nano';
        if (volumeGallons <= 40) return 'Small';
        if (volumeGallons <= 75) return 'Medium';
        if (volumeGallons <= 150) return 'Large';
        return 'Extra Large';
    }

    /**
     * Get popular tank presets for a volume
     * @param {number} volumeGallons - Target volume in gallons
     * @returns {Array} Array of popular tank dimensions
     */
    getPopularPresets(volumeGallons) {
        const presets = [
            { name: '10 Gallon', width: 20, length: 10, height: 12, volume: 10 },
            { name: '20 Gallon Long', width: 30, length: 12, height: 12, volume: 20 },
            { name: '20 Gallon High', width: 24, length: 12, height: 16, volume: 20 },
            { name: '29 Gallon', width: 30, length: 12, height: 18, volume: 29 },
            { name: '30 Gallon', width: 36, length: 12, height: 16, volume: 30 },
            { name: '40 Gallon Breeder', width: 36, length: 18, height: 16, volume: 40 },
            { name: '40 Gallon Long', width: 48, length: 12, height: 16, volume: 40 },
            { name: '55 Gallon', width: 48, length: 12, height: 21, volume: 55 },
            { name: '75 Gallon', width: 48, length: 18, height: 21, volume: 75 },
            { name: '90 Gallon', width: 48, length: 18, height: 24, volume: 90 },
            { name: '120 Gallon', width: 48, length: 24, height: 24, volume: 120 },
            { name: '125 Gallon', width: 72, length: 18, height: 21, volume: 125 },
            { name: '150 Gallon', width: 72, length: 18, height: 24, volume: 150 },
            { name: '180 Gallon', width: 72, length: 24, height: 24, volume: 180 }
        ];

        const tolerance = volumeGallons * 0.2; // 20% tolerance
        return presets.filter(preset => {
            return Math.abs(preset.volume - volumeGallons) <= tolerance;
        });
    }
}
