import { loadJSONDataSync } from '../utils/json-loader.js';
import { logger } from '../utils/logger.js';

const defaultConstantsData = {
  conversions: {
    GALLONS_TO_LITERS: 3.78541,
    LITERS_TO_GALLONS: 0.264172,
    INCHES_TO_CM: 2.54,
    CM_TO_INCHES: 0.393701,
    DISPLACEMENT_PERCENT: 0.1,
  },
  unit_systems: {
    IMPERIAL: 'imperial',
    METRIC: 'metric',
  },
  volume_units: {
    GALLONS: 'gallons',
    LITERS: 'liters',
  },
  dimensions: {
    WIDTH: 'width',
    LENGTH: 'length',
    HEIGHT: 'height',
  },
  default_values: {
    WIDTH_INCHES: 48,
    LENGTH_INCHES: 24,
    HEIGHT_INCHES: 24,
    UNIT_SYSTEM: 'imperial',
    VOLUME_UNIT: 'liters',
  },
};

let constantsData = defaultConstantsData;

// Load constants from JSON file on module load
loadJSONDataSync('/data/constants.json', defaultConstantsData, 'constants', data => {
  constantsData = data;
});

export const CONVERSIONS = constantsData.conversions;
export const UNIT_SYSTEMS = constantsData.unit_systems;
export const VOLUME_UNITS = constantsData.volume_units;
export const DIMENSIONS = constantsData.dimensions;
export const DEFAULT_VALUES = constantsData.default_values;

// Function to load constants from JSON file
export async function loadConstantsFromJSON() {
  try {
    const response = await fetch('/data/constants.json');
    const data = await response.json();

    // Update the constants data
    constantsData = data;

    // Update the exported constants to use the new data
    Object.assign(CONVERSIONS, constantsData.conversions);
    Object.assign(UNIT_SYSTEMS, constantsData.unit_systems);
    Object.assign(VOLUME_UNITS, constantsData.volume_units);
    Object.assign(DIMENSIONS, constantsData.dimensions);
    Object.assign(DEFAULT_VALUES, constantsData.default_values);

    return true;
  } catch (error) {
    logger.error('Failed to load constants from JSON:', error);
    return false;
  }
}
