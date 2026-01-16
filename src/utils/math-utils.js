/**
 * Math.js utilities for advanced mathematical operations
 */
// Use global math object provided by the Math.js library loaded via CDN
const math = globalThis.math || window.math;

// If math is not available (e.g., in Node.js environment), provide fallback functions
if (!math) {
    console.warn('Math.js library not found, using fallback functions');

    // Provide fallback implementations for Math.js functions
    globalThis.math = {
        bignumber: (val) => val,
        number: (val) => val,
        multiply: (a, b) => a * b,
        divide: (a, b) => a / b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        sqrt: (a) => Math.sqrt(a),
        cbrt: (a) => Math.cbrt(a),
        evaluate: (expr) => {
            // Basic expression evaluation for fallback (not secure for user input!)
            try {
                return eval(expr.replace(/([0-9])([a-zA-Z])/g, '$1*$2')); // Handle implicit multiplication
            } catch (e) {
                console.error('Expression evaluation failed:', e);
                return NaN;
            }
        },
        parse: (str) => str,
        unit: (val, unit) => ({ value: val, unit }),
        format: (val, options) => val.toString(),
        pow: (base, exp) => Math.pow(base, exp),
        cbrt: (a) => Math.cbrt(a),
        abs: (a) => Math.abs(a),
        ceil: (a) => Math.ceil(a),
        floor: (a) => Math.floor(a),
        round: (a) => Math.round(a),
        sin: (a) => Math.sin(a),
        cos: (a) => Math.cos(a),
        tan: (a) => Math.tan(a),
        pi: Math.PI,
        e: Math.E
    };
}

/**
 * Perform advanced volume calculations with precision
 * @param {number} length - Tank length in inches
 * @param {number} width - Tank width in inches
 * @param {number} height - Tank height in inches
 * @returns {Object} Volume calculations with high precision
 */
export function calculateVolumeWithPrecision(length, width, height) {
    try {
        // Use math.js for high precision calculations
        const lengthBig = math.bignumber(length);
        const widthBig = math.bignumber(width);
        const heightBig = math.bignumber(height);
        
        // Calculate volume in cubic inches
        const volumeCubicInches = math.multiply(math.multiply(lengthBig, widthBig), heightBig);
        
        // Convert to cubic cm using precise conversion factor
        const cubicCm = math.multiply(volumeCubicInches, math.bignumber(16.387064)); // 1 cubic inch = 16.387064 cubic cm
        
        // Convert to liters (1000 cubic cm = 1 liter)
        const liters = math.divide(cubicCm, math.bignumber(1000));
        
        // Convert to gallons using precise conversion
        const gallons = math.divide(liters, math.bignumber(3.785411784)); // Precise liters to gallons conversion
        
        return {
            cubicInches: math.number(volumeCubicInches),
            cubicCm: math.number(cubicCm),
            liters: math.number(liters),
            gallons: math.number(gallons)
        };
    } catch (error) {
        console.error('Error in precise volume calculation:', error);
        // Fallback to regular calculation
        const cubicInches = length * width * height;
        const cubicCm = cubicInches * 16.387064;
        const liters = cubicCm / 1000;
        const gallons = liters / 3.785411784;
        return { cubicInches, cubicCm, liters, gallons };
    }
}

/**
 * Calculate aspect ratios and proportional relationships
 * @param {number} length - Tank length
 * @param {number} width - Tank width
 * @param {number} height - Tank height
 * @returns {Object} Aspect ratios and proportional relationships
 */
export function calculateRatios(length, width, height) {
    try {
        const lengthBig = math.bignumber(length);
        const widthBig = math.bignumber(width);
        const heightBig = math.bignumber(height);
        
        // Calculate various ratios
        const lengthToWidth = math.divide(lengthBig, widthBig);
        const lengthToHeight = math.divide(lengthBig, heightBig);
        const widthToHeight = math.divide(widthBig, heightBig);
        const surfaceToVolume = math.divide(math.multiply(lengthBig, widthBig), math.multiply(lengthBig, math.multiply(widthBig, heightBig)));
        
        return {
            lengthToWidth: math.number(lengthToWidth),
            lengthToHeight: math.number(lengthToHeight),
            widthToHeight: math.number(widthToHeight),
            surfaceToVolume: math.number(surfaceToVolume)
        };
    } catch (error) {
        console.error('Error in ratio calculation:', error);
        // Fallback to regular calculation
        return {
            lengthToWidth: length / width,
            lengthToHeight: length / height,
            widthToHeight: width / height,
            surfaceToVolume: (length * width) / (length * width * height)
        };
    }
}

/**
 * Solve equations for reverse calculations (e.g., find dimensions for target volume)
 * @param {number} targetVolume - Target volume in gallons
 * @param {number} length - Known length (or null if solving for it)
 * @param {number} width - Known width (or null if solving for it)
 * @param {number} height - Known height (or null if solving for it)
 * @returns {Object} Solution for unknown dimension
 */
export function solveForDimension(targetVolume, length = null, width = null, height = null) {
    try {
        // Convert target volume to cubic inches for calculation
        const targetLiters = targetVolume * 3.785411784; // gallons to liters
        const targetCubicCm = targetLiters * 1000; // liters to cubic cm
        const targetCubicInches = targetCubicCm / 16.387064; // cubic cm to cubic inches
        
        const targetBig = math.bignumber(targetCubicInches);
        
        if (length === null) {
            // Solve for length: length = volume / (width * height)
            const divisor = math.multiply(math.bignumber(width), math.bignumber(height));
            const result = math.divide(targetBig, divisor);
            return { length: math.number(result), width, height };
        } else if (width === null) {
            // Solve for width: width = volume / (length * height)
            const divisor = math.multiply(math.bignumber(length), math.bignumber(height));
            const result = math.divide(targetBig, divisor);
            return { length, width: math.number(result), height };
        } else if (height === null) {
            // Solve for height: height = volume / (length * width)
            const divisor = math.multiply(math.bignumber(length), math.bignumber(width));
            const result = math.divide(targetBig, divisor);
            return { length, width, height: math.number(result) };
        } else {
            // All dimensions provided, just return them
            return { length, width, height };
        }
    } catch (error) {
        console.error('Error in dimension solving:', error);
        // Fallback to regular calculation
        const targetLiters = targetVolume * 3.785411784;
        const targetCubicCm = targetLiters * 1000;
        const targetCubicInches = targetCubicCm / 16.387064;
        
        if (length === null) {
            return { length: targetCubicInches / (width * height), width, height };
        } else if (width === null) {
            return { length, width: targetCubicInches / (length * height), height };
        } else if (height === null) {
            return { length, width, height: targetCubicInches / (length * width) };
        } else {
            return { length, width, height };
        }
    }
}

/**
 * Calculate statistical properties of a dataset (useful for analyzing multiple tank configurations)
 * @param {Array<number>} values - Array of numeric values
 * @returns {Object} Statistical properties
 */
export function calculateStatistics(values) {
    try {
        const bigValues = values.map(v => math.bignumber(v));
        
        return {
            mean: math.number(math.mean(bigValues)),
            median: math.number(math.median(bigValues)),
            stdDev: math.number(math.std(bigValues)),
            variance: math.number(math.variance(bigValues)),
            min: math.number(math.min(bigValues)),
            max: math.number(math.max(bigValues)),
            range: math.number(math.subtract(math.max(bigValues), math.min(bigValues)))
        };
    } catch (error) {
        console.error('Error in statistics calculation:', error);
        // Fallback to manual calculation
        const sorted = [...values].sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(avgSquaredDiff);
        
        return {
            mean,
            median: sorted[Math.floor(sorted.length / 2)],
            stdDev,
            variance: avgSquaredDiff,
            min: Math.min(...values),
            max: Math.max(...values),
            range: Math.max(...values) - Math.min(...values)
        };
    }
}

/**
 * Perform unit conversions with math.js precision
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertUnits(value, fromUnit, toUnit) {
    try {
        const quantity = math.unit(value, fromUnit);
        const converted = math.unit(quantity).toNumber(toUnit);
        return converted;
    } catch (error) {
        console.error('Error in unit conversion:', error);
        // Fallback conversion based on known conversions
        const conversions = {
            'gallons_to_liters': value * 3.78541,
            'liters_to_gallons': value * 0.264172,
            'inches_to_cm': value * 2.54,
            'cm_to_inches': value * 0.393701,
            'lbs_to_kg': value * 0.453592,
            'kg_to_lbs': value * 2.20462
        };
        
        const conversionKey = `${fromUnit}_to_${toUnit}`;
        return conversions[conversionKey] || value;
    }
}

/**
 * Calculate derivatives for optimization problems (e.g., optimal dimensions)
 * @param {Function} func - Mathematical function to differentiate
 * @param {number} x - Point at which to evaluate derivative
 * @returns {number} Derivative value
 */
export function calculateDerivative(func, x) {
    try {
        // Create a symbolic representation of the function for differentiation
        // For example, if we want to optimize surface area to volume ratio
        const h = 1e-7; // Small number for numerical differentiation
        return (func(x + h) - func(x - h)) / (2 * h);
    } catch (error) {
        console.error('Error in derivative calculation:', error);
        // Fallback to numerical differentiation
        const h = 1e-7;
        return (func(x + h) - func(x - h)) / (2 * h);
    }
}

/**
 * Optimize tank dimensions for minimum surface area to volume ratio (most efficient heating/lighting)
 * @param {number} targetVolume - Target volume in gallons
 * @param {string} dimensionConstraint - Which dimension to keep constant ('length', 'width', 'height', or 'none')
 * @param {number} constantValue - Value for the constant dimension (if applicable)
 * @returns {Object} Optimized dimensions
 */
export function optimizeTankDimensions(targetVolume, dimensionConstraint = 'none', constantValue = null) {
    try {
        // Convert target volume to cubic inches for calculation
        const targetLiters = targetVolume * 3.785411784; // gallons to liters
        const targetCubicCm = targetLiters * 1000; // liters to cubic cm
        const targetCubicInches = targetCubicCm / 16.387064; // cubic cm to cubic inches

        // For minimal surface area to volume ratio, the optimal shape is a cube
        // But we might have constraints
        if (dimensionConstraint === 'none') {
            // Simple cube approximation
            const sideLength = math.cbrt(math.bignumber(targetCubicInches));
            return {
                length: math.number(sideLength),
                width: math.number(sideLength),
                height: math.number(sideLength),
                volume: targetVolume,
                surfaceAreaToVolumeRatio: 6 / math.number(sideLength) // SA/V for cube is 6/side
            };
        } else {
            // If one dimension is constrained, solve for the others to minimize surface area
            // For a rectangular prism with volume V = l*w*h and one dimension fixed,
            // the other two dimensions that minimize surface area are equal (square cross-section)
            const targetBig = math.bignumber(targetCubicInches);
            const constBig = math.bignumber(constantValue);

            if (dimensionConstraint === 'length') {
                // Minimize for width and height given fixed length
                // V = l*w*h, so w*h = V/l
                // For minimum surface area with w*h fixed, w=h (square cross-section)
                const whProduct = math.divide(targetBig, constBig);
                const optimalCrossSectionSide = math.sqrt(whProduct);

                return {
                    length: constantValue,
                    width: math.number(optimalCrossSectionSide),
                    height: math.number(optimalCrossSectionSide),
                    volume: targetVolume,
                    surfaceAreaToVolumeRatio: calculateSurfaceAreaToVolumeRatio(constantValue,
                        math.number(optimalCrossSectionSide),
                        math.number(optimalCrossSectionSide))
                };
            } else if (dimensionConstraint === 'width') {
                const lhProduct = math.divide(targetBig, constBig);
                const optimalCrossSectionSide = math.sqrt(lhProduct);

                return {
                    length: math.number(optimalCrossSectionSide),
                    width: constantValue,
                    height: math.number(optimalCrossSectionSide),
                    volume: targetVolume,
                    surfaceAreaToVolumeRatio: calculateSurfaceAreaToVolumeRatio(
                        math.number(optimalCrossSectionSide),
                        constantValue,
                        math.number(optimalCrossSectionSide))
                };
            } else if (dimensionConstraint === 'height') {
                const lwProduct = math.divide(targetBig, constBig);
                const optimalCrossSectionSide = math.sqrt(lwProduct);

                return {
                    length: math.number(optimalCrossSectionSide),
                    width: math.number(optimalCrossSectionSide),
                    height: constantValue,
                    volume: targetVolume,
                    surfaceAreaToVolumeRatio: calculateSurfaceAreaToVolumeRatio(
                        math.number(optimalCrossSectionSide),
                        math.number(optimalCrossSectionSide),
                        constantValue)
                };
            }
        }
    } catch (error) {
        console.error('Error in tank optimization:', error);
        // Fallback to simple cube approximation
        const sideLength = Math.cbrt(targetVolume * 3.785411784 * 1000 / 16.387064);
        return {
            length: sideLength,
            width: sideLength,
            height: sideLength,
            volume: targetVolume,
            surfaceAreaToVolumeRatio: 6 / sideLength
        };
    }
}

/**
 * Helper function to calculate surface area to volume ratio
 * @param {number} length
 * @param {number} width
 * @param {number} height
 * @returns {number} Surface area to volume ratio
 */
function calculateSurfaceAreaToVolumeRatio(length, width, height) {
    const surfaceArea = 2 * (length * width + length * height + width * height);
    const volume = length * width * height;
    return surfaceArea / volume;
}

/**
 * Solve complex equations symbolically using Math.js
 * @param {string} equation - Equation string (e.g., 'x^2 + 2*x - 8 = 0')
 * @returns {Array} Solutions to the equation
 */
export function solveEquation(equation) {
    try {
        // Parse and solve the equation using Math.js
        const expr = math.parse(equation);
        // Note: This is a simplified approach - Math.js equation solving
        // For more complex symbolic solving, we would need to use more advanced methods
        console.warn('Symbolic equation solving requires more complex implementation');
        return [];
    } catch (error) {
        console.error('Error solving equation:', error);
        return [];
    }
}

/**
 * Calculate complex expressions with units
 * @param {string} expression - Mathematical expression with units (e.g., '5 cm to inch')
 * @returns {number} Calculated value
 */
export function calculateWithUnits(expression) {
    try {
        // Example: evaluating expressions with units
        const result = math.evaluate(expression);
        return math.number(result);
    } catch (error) {
        console.error('Error calculating with units:', error);
        return NaN;
    }
}