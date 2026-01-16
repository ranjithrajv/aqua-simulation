// Tank volume and calculation utilities
import { CONVERSIONS } from '../../config/constants.js';
// Use global math object provided by Math.js library loaded via CDN in index.html
const math = typeof window !== 'undefined' && window.math ? window.math : globalThis.math;

export class TankCalculator {
  /**
   * Calculate tank volume in liters
   * @param {number} length - Length in inches
   * @param {number} width - Width in inches
   * @param {number} height - Height in inches
   * @returns {number} Volume in liters
   */
  calculateVolume(length, width, height) {
    try {
      // Validate inputs
      if (typeof length !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Invalid input: all parameters must be numbers');
      }

      if (length <= 0 || width <= 0 || height <= 0) {
        throw new Error('Invalid input: dimensions must be positive numbers');
      }

      // Use Math.js for higher precision calculations
      const lengthBig = math.bignumber(length);
      const widthBig = math.bignumber(width);
      const heightBig = math.bignumber(height);

      // Convert inches to cm using Math.js
      const cmConversionFactor = math.bignumber(CONVERSIONS.INCHES_TO_CM);
      const lengthCm = math.multiply(lengthBig, cmConversionFactor);
      const widthCm = math.multiply(widthBig, cmConversionFactor);
      const heightCm = math.multiply(heightBig, cmConversionFactor);

      // Volume in cm³ using Math.js
      const volumeCm3 = math.multiply(math.multiply(lengthCm, widthCm), heightCm);

      // Convert to liters (1 liter = 1000 cm³) using Math.js
      const litersDivisor = math.bignumber(1000);
      const volumeLiters = math.divide(volumeCm3, litersDivisor);

      // Convert back to number for return
      const result = math.number(volumeLiters);

      // Validate result
      if (!isFinite(result)) {
        throw new Error('Invalid calculation result: volume is not finite');
      }

      return result;
    } catch (error) {
      console.error('Error calculating volume:', error.message);
      // Fallback to original calculation if math.js fails
      try {
        const lengthCm = length * CONVERSIONS.INCHES_TO_CM;
        const widthCm = width * CONVERSIONS.INCHES_TO_CM;
        const heightCm = height * CONVERSIONS.INCHES_TO_CM;
        const volumeCm3 = lengthCm * widthCm * heightCm;
        return volumeCm3 / 1000;
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return 0; // Return a safe default value
      }
    }
  }

  /**
   * Convert liters to US gallons
   * @param {number} liters - Volume in liters
   * @returns {number} Volume in US gallons
   */
  convertToGallons(liters) {
    try {
      if (typeof liters !== 'number') {
        throw new Error('Invalid input: liters must be a number');
      }

      if (liters < 0) {
        throw new Error('Invalid input: liters must be a non-negative number');
      }

      // Use Math.js for higher precision conversion
      const litersBig = math.bignumber(liters);
      const conversionFactor = math.bignumber(CONVERSIONS.LITERS_TO_GALLONS);
      const gallons = math.multiply(litersBig, conversionFactor);

      const result = math.number(gallons);

      if (!isFinite(result)) {
        throw new Error('Invalid calculation result: gallons is not finite');
      }

      return result;
    } catch (error) {
      console.error('Error converting liters to gallons:', error.message);
      // Fallback to original calculation
      try {
        return liters * CONVERSIONS.LITERS_TO_GALLONS;
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return 0; // Return a safe default value
      }
    }
  }

  /**
   * Convert gallons to liters
   * @param {number} gallons - Volume in gallons
   * @returns {number} Volume in liters
   */
  convertToLiters(gallons) {
    try {
      if (typeof gallons !== 'number') {
        throw new Error('Invalid input: gallons must be a number');
      }

      if (gallons < 0) {
        throw new Error('Invalid input: gallons must be a non-negative number');
      }

      // Use Math.js for higher precision conversion
      const gallonsBig = math.bignumber(gallons);
      const conversionFactor = math.bignumber(CONVERSIONS.GALLONS_TO_LITERS);
      const liters = math.multiply(gallonsBig, conversionFactor);

      const result = math.number(liters);

      if (!isFinite(result)) {
        throw new Error('Invalid calculation result: liters is not finite');
      }

      return result;
    } catch (error) {
      console.error('Error converting gallons to liters:', error.message);
      // Fallback to original calculation
      try {
        return gallons * CONVERSIONS.GALLONS_TO_LITERS;
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return 0; // Return a safe default value
      }
    }
  }

  /**
   * Adjust volume for displacement (substrate, rocks, decorations)
   * @param {number} volumeLiters - Full geometric volume in liters
   * @param {number} displacementPercent - Percentage to subtract (default from constants)
   * @returns {number} Adjusted water volume in liters
   */
  adjustForDisplacement(volumeLiters, displacementPercent = CONVERSIONS.DISPLACEMENT_PERCENT) {
    try {
      if (typeof volumeLiters !== 'number' || typeof displacementPercent !== 'number') {
        throw new Error('Invalid input: volumeLiters and displacementPercent must be numbers');
      }

      if (volumeLiters < 0 || displacementPercent < 0 || displacementPercent > 1) {
        throw new Error(
          'Invalid input: volumeLiters must be non-negative, displacementPercent must be between 0 and 1'
        );
      }

      // Use Math.js for higher precision calculation
      const volumeBig = math.bignumber(volumeLiters);
      const displacementBig = math.bignumber(displacementPercent);
      const one = math.bignumber(1);
      const factor = math.subtract(one, displacementBig);
      const adjustedVolume = math.multiply(volumeBig, factor);

      const result = math.number(adjustedVolume);

      if (!isFinite(result)) {
        throw new Error('Invalid calculation result: adjusted volume is not finite');
      }

      return result;
    } catch (error) {
      console.error('Error adjusting for displacement:', error.message);
      // Fallback to original calculation
      try {
        return volumeLiters * (1 - displacementPercent);
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return 0; // Return a safe default value
      }
    }
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
      waterGallons: waterGallons,
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
    try {
      // Validate inputs
      if (typeof length !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Invalid input: all parameters must be numbers');
      }

      if (length <= 0 || width <= 0 || height <= 0) {
        throw new Error('Invalid input: dimensions must be positive numbers');
      }

      // Use Math.js for higher precision calculations
      const lengthBig = math.bignumber(length);
      const widthBig = math.bignumber(width);
      const heightBig = math.bignumber(height);
      const two = math.bignumber(2);

      const topBottom = math.multiply(two, math.multiply(lengthBig, widthBig));
      const frontBack = math.multiply(two, math.multiply(lengthBig, heightBig));
      const leftRight = math.multiply(two, math.multiply(widthBig, heightBig));

      const totalAreaSqInBig = math.add(math.add(topBottom, frontBack), leftRight);
      const topAreaSqInBig = math.multiply(lengthBig, widthBig);

      // Convert to numbers
      const totalAreaSqIn = math.number(totalAreaSqInBig);
      const topAreaSqIn = math.number(topAreaSqInBig);

      // Validate results
      if (!isFinite(totalAreaSqIn) || !isFinite(topAreaSqIn)) {
        throw new Error('Invalid calculation result: surface area is not finite');
      }

      // Calculate square feet using Math.js
      const sqInToSqFt = math.bignumber(144);
      const totalSqFt = math.number(math.divide(totalAreaSqInBig, sqInToSqFt));
      const topSqFt = math.number(math.divide(topAreaSqInBig, sqInToSqFt));

      return {
        totalSqIn: totalAreaSqIn,
        totalSqFt: totalSqFt,
        topSqIn: topAreaSqIn,
        topSqFt: topSqFt,
      };
    } catch (error) {
      console.error('Error calculating surface area:', error.message);
      // Fallback to original calculation
      try {
        const topBottom = 2 * (length * width);
        const frontBack = 2 * (length * height);
        const leftRight = 2 * (width * height);
        const totalAreaSqIn = topBottom + frontBack + leftRight;
        const topAreaSqIn = length * width;

        return {
          totalSqIn: totalAreaSqIn,
          totalSqFt: totalAreaSqIn / 144,
          topSqIn: topAreaSqIn,
          topSqFt: topAreaSqIn / 144,
        };
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return {
          totalSqIn: 0,
          totalSqFt: 0,
          topSqIn: 0,
          topSqFt: 0,
        }; // Return safe default values
      }
    }
  }

  calculateWaterWeight(waterGallons, isSaltwater = false) {
    try {
      if (typeof waterGallons !== 'number') {
        throw new Error('Invalid input: waterGallons must be a number');
      }

      if (waterGallons < 0) {
        throw new Error('Invalid input: waterGallons must be a non-negative number');
      }

      // Use Math.js for higher precision calculations
      const gallonsBig = math.bignumber(waterGallons);
      const density = isSaltwater ? math.bignumber(8.55) : math.bignumber(8.34);
      const litersPerGallon = math.bignumber(3.78541);
      const specificGravity = isSaltwater ? math.bignumber(1.025) : math.bignumber(1);

      const weightLbsBig = math.multiply(gallonsBig, density);
      const weightKgBig = math.multiply(
        math.multiply(gallonsBig, litersPerGallon),
        specificGravity
      );

      const weightLbs = math.number(weightLbsBig);
      const weightKg = math.number(weightKgBig);

      if (!isFinite(weightLbs) || !isFinite(weightKg)) {
        throw new Error('Invalid calculation result: weight is not finite');
      }

      return {
        lbs: weightLbs,
        kg: weightKg,
        isSaltwater,
      };
    } catch (error) {
      console.error('Error calculating water weight:', error.message);
      // Fallback to original calculation
      try {
        const density = isSaltwater ? 8.55 : 8.34;
        const weightLbs = waterGallons * density;
        const weightKg = waterGallons * 3.78541 * (isSaltwater ? 1.025 : 1);

        return {
          lbs: weightLbs,
          kg: weightKg,
          isSaltwater,
        };
      } catch (fallbackError) {
        console.error('Fallback calculation also failed:', fallbackError.message);
        return {
          lbs: 0,
          kg: 0,
          isSaltwater,
        }; // Return safe default values
      }
    }
  }
}
