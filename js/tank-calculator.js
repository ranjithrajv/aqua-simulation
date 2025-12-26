// Tank volume and calculation utilities
import { CONVERSIONS } from './constants.js';

export class TankCalculator {
    /**
     * Calculate tank volume in liters
     * @param {number} length - Length in inches
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @returns {number} Volume in liters
     */
    calculateVolume(length, width, height) {
        // Convert inches to cm
        const lengthCm = length * CONVERSIONS.INCHES_TO_CM;
        const widthCm = width * CONVERSIONS.INCHES_TO_CM;
        const heightCm = height * CONVERSIONS.INCHES_TO_CM;

        // Volume in cm³
        const volumeCm3 = lengthCm * widthCm * heightCm;

        // Convert to liters (1 liter = 1000 cm³)
        return volumeCm3 / 1000;
    }

    /**
     * Convert liters to US gallons
     * @param {number} liters - Volume in liters
     * @returns {number} Volume in US gallons
     */
    convertToGallons(liters) {
        return liters * CONVERSIONS.GALLONS_TO_LITERS;
    }

    /**
     * Convert gallons to liters
     * @param {number} gallons - Volume in gallons
     * @returns {number} Volume in liters
     */
    convertToLiters(gallons) {
        return gallons / CONVERSIONS.GALLONS_TO_LITERS;
    }

    /**
     * Adjust volume for displacement (substrate, rocks, decorations)
     * @param {number} volumeLiters - Full geometric volume in liters
     * @param {number} displacementPercent - Percentage to subtract (default from constants)
     * @returns {number} Adjusted water volume in liters
     */
    adjustForDisplacement(volumeLiters, displacementPercent = CONVERSIONS.DISPLACEMENT_PERCENT) {
        return volumeLiters * (1 - displacementPercent);
    }

    /**
     * Get volume in different units for display
     * @param {number} length - Length in inches
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @returns {object} Volume in multiple units
     */
    getVolumeInfo(length, width, height) {
        const liters = this.calculateVolume(length, width, height);
        const gallons = this.convertToGallons(liters);
        const waterLiters = this.adjustForDisplacement(liters);
        const waterGallons = this.convertToGallons(waterLiters);

        return {
            geometricLiters: liters,
            geometricGallons: gallons,
            waterLiters: waterLiters,
            waterGallons: waterGallons
        };
    }

    /**
     * Calculate surface area of tank
     * @param {number} length - Length in inches
     * @param {number} width - Width in inches
     * @param {number} height - Height in inches
     * @returns {object} Surface area in square inches and square feet
     */
    calculateSurfaceArea(length, width, height) {
        const topBottom = 2 * (length * width);
        const frontBack = 2 * (length * height);
        const leftRight = 2 * (width * height);

        const totalAreaSqIn = topBottom + frontBack + leftRight;
        const topAreaSqIn = length * width;

        return {
            totalSqIn: totalAreaSqIn,
            totalSqFt: totalAreaSqIn / 144,
            topSqIn: topAreaSqIn,
            topSqFt: topAreaSqIn / 144
        };
    }
}