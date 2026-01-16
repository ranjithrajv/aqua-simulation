// Aquarium Tank Simulator - Complete Working Bundle
console.log('Loading Aquarium Tank Simulator...');

// Basic constants
const CONVERSIONS = {
  INCHES_TO_CM: 2.54,
  GALLONS_TO_LITERS: 3.78541,
  DISPLACEMENT_PERCENT: 0.1,
};

// Basic Tank Calculator
class TankCalculator {
  calculateVolume(length, width, height) {
    // Convert to cm for calculation
    const lengthCm = length * CONVERSIONS.INCHES_TO_CM;
    const widthCm = width * CONVERSIONS.INCHES_TO_CM;
    const heightCm = height * CONVERSIONS.INCHES_TO_CM;

    // Volume in cubic cm to liters
    const volumeCm3 = lengthCm * widthCm * heightCm;
    const liters = volumeCm3 / 1000;

    return liters;
  }

  convertToGallons(liters) {
    return liters / CONVERSIONS.GALLONS_TO_LITERS;
  }

  adjustForDisplacement(liters) {
    return liters * (1 - CONVERSIONS.DISPLACEMENT_PERCENT);
  }

  calculateSurfaceArea(length, width, height) {
    const lengthIn = length;
    const widthIn = width;
    const heightIn = height;

    const topSqFt = (lengthIn * widthIn) / 144;
    const frontSqFt = (lengthIn * heightIn) / 144;
    const sideSqFt = (widthIn * heightIn) / 144;

    return {
      topSqFt: topSqFt,
      frontSqFt: frontSqFt,
      sideSqFt: sideSqFt,
      topSqIn: lengthIn * widthIn,
      frontSqIn: lengthIn * heightIn,
      sideSqIn: widthIn * heightIn,
    };
  }

  calculateWaterWeight(gallons, isSaltwater = false) {
    const lbsPerGallon = isSaltwater ? 8.55 : 8.34;
    const lbs = gallons * lbsPerGallon;
    const kg = lbs * 0.453592;

    return { lbs, kg };
  }
}

// Basic Glass Recommender
class GlassRecommender {
  getRecommendation(length, width, height) {
    const maxDimension = Math.max(length, width, height);
    const volumeGallons = this.estimateVolume(length, width, height);

    if (maxDimension <= 18 && volumeGallons <= 20) {
      return '1/4" (6mm)';
    } else if (maxDimension <= 24 && volumeGallons <= 50) {
      return '3/8" (10mm)';
    } else if (maxDimension <= 36 && volumeGallons <= 100) {
      return '1/2" (12mm)';
    } else if (maxDimension <= 48 && volumeGallons <= 180) {
      return '5/8" (15mm)';
    } else {
      return '3/4" (19mm)';
    }
  }

  getDetailedRecommendation(length, width, height) {
    const recommendation = this.getRecommendation(length, width, height);
    const maxDimension = Math.max(length, width, height);

    let safetyNote = 'Standard aquarium glass recommended';
    if (maxDimension > 30) {
      safetyNote = 'Consider using tempered glass for large panels';
    }
    if (maxDimension > 48) {
      safetyNote = 'Professional installation recommended. Use safety glass.';
    }

    return {
      thickness: recommendation,
      safetyNote: safetyNote,
    };
  }

  estimateVolume(length, width, height) {
    const calculator = new TankCalculator();
    const liters = calculator.calculateVolume(length, width, height);
    return calculator.convertToGallons(liters);
  }
}

// Main Application Class
class AquariumApp {
  constructor() {
    this.calculator = new TankCalculator();
    this.recommender = new GlassRecommender();
    this.currentUnitSystem = 'imperial';
    this.volumeUnitSystem = 'gallons';
    this.waterType = 'freshwater';
    this.init();
  }

  init() {
    this.setupDimensionControls();
    this.setupUnitSystem();
    this.setupWaterTypeControls();
    this.setupTankPresets();
    this.updateCalculations();
    console.log('Aquarium Tank Simulator initialized');
  }

  setupDimensionControls() {
    ['width', 'length', 'height'].forEach(dimension => {
      const input = document.getElementById(dimension);
      const valueDisplay = document.getElementById(`${dimension}Value`);

      if (!input || !valueDisplay) return;

      input.addEventListener('input', e => {
        const value = parseFloat(e.target.value);
        this.setText(`${dimension}Value`, value);
        this.updateCalculations();
      });

      this.setText(`${dimension}Value`, input.value);
    });
  }

  setupUnitSystem() {
    const unitSelector = document.getElementById('unitSystem');
    if (unitSelector) {
      unitSelector.addEventListener('change', e => {
        this.currentUnitSystem = e.target.value;
        this.updateUnitDisplays();
        this.updateCalculations();
      });
    }

    this.updateUnitDisplays();
  }

  setupWaterTypeControls() {
    const waterTypeSelect = document.getElementById('waterType');
    if (waterTypeSelect) {
      waterTypeSelect.addEventListener('change', e => {
        this.waterType = e.target.value;
        this.updateCalculations();
      });
    }
  }

  setupTankPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
      button.addEventListener('click', e => {
        const btn = e.target.closest('.preset-btn');
        const width = parseInt(btn.dataset.width);
        const length = parseInt(btn.dataset.length);
        const height = parseInt(btn.dataset.height);

        if (isNaN(width) || isNaN(length) || isNaN(height)) return;

        this.setAllDimensions(width, length, height);
        this.updateCalculations();

        // Visual feedback
        btn.style.background = '#4CAF50';
        setTimeout(() => {
          btn.style.background = '#667eea';
        }, 600);
      });
    });
  }

  setAllDimensions(width, length, height) {
    ['width', 'length', 'height'].forEach(dimension => {
      const input = document.getElementById(dimension);
      const valueDisplay = document.getElementById(`${dimension}Value`);
      if (input && valueDisplay) {
        input.value = width;
        valueDisplay.textContent = width;
      }
    });
  }

  getTankDimensions() {
    return {
      width: parseFloat(this.getValue('width')),
      length: parseFloat(this.getValue('length')),
      height: parseFloat(this.getValue('height')),
    };
  }

  getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  updateUnitDisplays() {
    const unit = this.currentUnitSystem === 'imperial' ? 'in' : 'cm';
    ['widthUnit', 'lengthUnit', 'heightUnit'].forEach(displayId => {
      this.setText(displayId, unit);
    });
  }

  updateCalculations() {
    const dimensions = this.getTankDimensions();
    if (!dimensions.width || !dimensions.length || !dimensions.height) return;

    const volumeData = this.calculateVolumeData(dimensions);
    const surfaceArea = this.calculator.calculateSurfaceArea(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const glassRecommendation = this.recommender.getRecommendation(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const detailedRecommendation = this.recommender.getDetailedRecommendation(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );

    // Update displays
    this.updateVolumeDisplays(volumeData);
    this.updateSurfaceAreaDisplay(surfaceArea);
    this.updateWaterWeightDisplay(volumeData.waterGallons);
    this.updateGlassDisplay(glassRecommendation, detailedRecommendation);
  }

  calculateVolumeData(dimensions) {
    const liters = this.calculator.calculateVolume(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const gallons = this.calculator.convertToGallons(liters);
    const waterLiters = this.calculator.adjustForDisplacement(liters);
    const waterGallons = this.calculator.convertToGallons(waterLiters);

    return { liters, gallons, waterLiters, waterGallons };
  }

  updateVolumeDisplays(volumeData) {
    if (this.volumeUnitSystem === 'gallons') {
      this.setText('volumeInput', volumeData.gallons);
      this.setText('volumeValue', volumeData.gallons);
      this.setText('waterVolumeInput', volumeData.waterGallons);
      this.setText('waterVolumeValue', volumeData.waterGallons);
    } else {
      this.setText('volumeInput', volumeData.liters);
      this.setText('volumeValue', volumeData.liters);
      this.setText('waterVolumeInput', volumeData.liters);
      this.setText('waterVolumeValue', volumeData.liters);
    }
  }

  updateSurfaceAreaDisplay(surfaceArea) {
    const topSqFt = Math.round(surfaceArea.topSqFt * 10) / 10;
    const topSqIn = Math.round(surfaceArea.topSqIn);

    this.setText('surfaceAreaResult', `${topSqFt} ft² (${topSqIn} in²)`);

    const indicator = document.getElementById('surfaceAreaText');
    if (indicator) {
      if (surfaceArea.topSqFt < 2) {
        indicator.textContent = 'Low oxygen exchange';
      } else if (surfaceArea.topSqFt < 4) {
        indicator.textContent = 'Good oxygen exchange';
      } else {
        indicator.textContent = 'Excellent oxygen exchange';
      }
    }
  }

  updateWaterWeightDisplay(waterGallons) {
    const weightData = this.calculator.calculateWaterWeight(
      waterGallons,
      this.waterType === 'saltwater'
    );
    const weightString = `${Math.round(weightData.lbs)} lbs (${Math.round(weightData.kg)} kg)`;
    this.setText('waterWeightResult', weightString);
  }

  updateGlassDisplay(thickness, detailed) {
    this.setText('glassResult', thickness);
    this.setText('glassNotes', detailed.safetyNote);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Aquarium Tank Simulator...');
  window.app = new AquariumApp();
});

console.log('Aquarium Tank Simulator bundle loaded');

// Test 1: Simple DOM manipulation
try {
  const testElement = document.getElementById('volumeValue');
  if (testElement) {
    testElement.textContent = 'TEST WORKING!';
    testElement.style.color = 'red';
    console.log('✅ DOM element found:', testElement);
  } else {
    console.error('❌ DOM element NOT found:', 'volumeValue');
  }
} catch (error) {
  console.error('❌ DOM test failed:', error);
}

// Test 2: Simple counter
let counter = 0;
setInterval(() => {
  counter++;
  console.log('Counter:', counter);
  if (counter === 5) {
    const title = document.querySelector('h1');
    if (title) {
      title.textContent = 'JavaScript is WORKING! ' + counter;
    }
  }
}, 2000);

// Test 3: Event listener
try {
  document.addEventListener('click', () => {
    console.log('🖱️ Click detected anywhere on page');
  });
} catch (error) {
  console.error('❌ Event listener failed:', error);
}

// Test 4: Check all required elements
const requiredElements = [
  'width',
  'length',
  'height',
  'volumeValue',
  'surfaceAreaResult',
  'glassResult',
];

console.log('Checking required elements:');
requiredElements.forEach(id => {
  const element = document.getElementById(id);
  console.log(`${id}:`, element ? '✅ FOUND' : '❌ MISSING');
});

console.log('=== DEBUGGING COMPLETE ===');

const UNIT_SYSTEMS = {
  IMPERIAL: 'imperial',
  METRIC: 'metric',
};

const VOLUME_UNITS = {
  GALLONS: 'gallons',
  LITERS: 'liters',
};

const DIMENSIONS = ['width', 'length', 'height'];

const DEFAULT_VALUES = {
  UNIT_SYSTEM: UNIT_SYSTEMS.IMPERIAL,
  VOLUME_UNIT: VOLUME_UNITS.GALLONS,
};

// Basic Tank Calculator
class TankCalculator {
  calculateVolume(length, width, height) {
    // Convert to cm for calculation
    const lengthCm = length * CONVERSIONS.INCHES_TO_CM;
    const widthCm = width * CONVERSIONS.INCHES_TO_CM;
    const heightCm = height * CONVERSIONS.INCHES_TO_CM;

    // Volume in cubic cm to liters
    const volumeCm3 = lengthCm * widthCm * heightCm;
    const liters = volumeCm3 / 1000;

    return liters;
  }

  convertToGallons(liters) {
    return liters / CONVERSIONS.GALLONS_TO_LITERS;
  }

  convertToLiters(gallons) {
    return gallons * CONVERSIONS.GALLONS_TO_LITERS;
  }

  adjustForDisplacement(liters) {
    return liters * (1 - CONVERSIONS.DISPLACEMENT_PERCENT);
  }

  calculateSurfaceArea(length, width, height) {
    const lengthCm = length * CONVERSIONS.INCHES_TO_CM;
    const widthCm = width * CONVERSIONS.INCHES_TO_CM;
    const heightCm = height * CONVERSIONS.INCHES_TO_CM;

    const lengthIn = length;
    const widthIn = width;
    const heightIn = height;

    const topSqFt = (lengthIn * widthIn) / 144;
    const frontSqFt = (lengthIn * heightIn) / 144;
    const sideSqFt = (widthIn * heightIn) / 144;

    return {
      topSqFt: topSqFt,
      frontSqFt: frontSqFt,
      sideSqFt: sideSqFt,
      topSqIn: lengthIn * widthIn,
      frontSqIn: lengthIn * heightIn,
      sideSqIn: widthIn * heightIn,
    };
  }

  calculateWaterWeight(gallons, isSaltwater = false) {
    const lbsPerGallon = isSaltwater ? 8.55 : 8.34;
    const lbs = gallons * lbsPerGallon;
    const kg = lbs * 0.453592;

    return { lbs, kg };
  }
}

// Basic Glass Recommender
class GlassRecommender {
  getRecommendation(length, width, height) {
    const maxDimension = Math.max(length, width, height);
    const volumeGallons = this.estimateVolume(length, width, height);

    if (maxDimension <= 18 && volumeGallons <= 20) {
      return '1/4" (6mm)';
    } else if (maxDimension <= 24 && volumeGallons <= 50) {
      return '3/8" (10mm)';
    } else if (maxDimension <= 36 && volumeGallons <= 100) {
      return '1/2" (12mm)';
    } else if (maxDimension <= 48 && volumeGallons <= 180) {
      return '5/8" (15mm)';
    } else {
      return '3/4" (19mm)';
    }
  }

  getDetailedRecommendation(length, width, height) {
    const recommendation = this.getRecommendation(length, width, height);
    const maxDimension = Math.max(length, width, height);

    let safetyNote = 'Standard aquarium glass recommended';
    if (maxDimension > 30) {
      safetyNote = 'Consider using tempered glass for large panels';
    }
    if (maxDimension > 48) {
      safetyNote = 'Professional installation recommended. Use safety glass.';
    }

    return {
      thickness: recommendation,
      safetyNote: safetyNote,
    };
  }

  estimateVolume(length, width, height) {
    const calculator = new TankCalculator();
    const liters = calculator.calculateVolume(length, width, height);
    return calculator.convertToGallons(liters);
  }
}

// Basic Equipment Recommender
class EquipmentRecommender {
  getAllRecommendations(length, width, height, volumeGallons, surfaceArea) {
    return {
      filter: this.getFilterRecommendation(volumeGallons),
      heater: this.getHeaterRecommendation(volumeGallons),
      chiller: this.getChillerRecommendation(volumeGallons),
      uvSterilizer: this.getUVSterilizerRecommendation(volumeGallons),
      airPump: this.getAirPumpRecommendation(volumeGallons),
      thermometer: this.getThermometerRecommendation(),
      circulationPump: this.getCirculationPumpRecommendation(volumeGallons),
      ato: this.getATORecommendation(volumeGallons),
    };
  }

  getFilterRecommendation(gallons) {
    const gph = Math.round(gallons * 4); // 4x turnover per hour
    if (gallons <= 20) return `HOB filter ${gph} GPH`;
    if (gallons <= 50) return `Canister filter ${gph} GPH`;
    if (gallons <= 100) return `Canister filter ${gph} GPH`;
    return `Sump system ${gph * 2} GPH`;
  }

  getHeaterRecommendation(gallons) {
    const watts = Math.round(gallons * 3); // 3-5 watts per gallon
    if (gallons <= 20) return `${watts}W submersible heater`;
    if (gallons <= 50) return `${watts}W submersible heater`;
    return `${watts}W dual heaters (${Math.round(watts / 2)}W each)`;
  }

  getChillerRecommendation(gallons) {
    if (gallons <= 30) return 'Not typically needed';
    if (gallons <= 75) return '1/4 HP chiller';
    if (gallons <= 150) return '1/3 HP chiller';
    return '1/2 HP+ chiller system';
  }

  getUVSterilizerRecommendation(gallons) {
    if (gallons <= 30) return '8W UV sterilizer';
    if (gallons <= 75) return '18W UV sterilizer';
    if (gallons <= 150) return '36W UV sterilizer';
    return '57W+ UV sterilizer';
  }

  getAirPumpRecommendation(gallons) {
    if (gallons <= 20) return 'Small air pump';
    if (gallons <= 50) return 'Medium air pump';
    if (gallons <= 100) return 'Large air pump';
    return 'Dual air pumps';
  }

  getThermometerRecommendation() {
    return 'Digital aquarium thermometer';
  }

  getCirculationPumpRecommendation(gallons) {
    if (gallons <= 50) return 'Powerhead 250-500 GPH';
    if (gallons <= 100) return 'Powerhead 500-900 GPH';
    return 'Multiple powerheads 1000+ GPH total';
  }

  getATORecommendation(gallons) {
    if (gallons <= 30) return 'Optional - manual top-off sufficient';
    if (gallons <= 75) return 'Basic ATO system recommended';
    return 'ATO system highly recommended';
  }
}

// DOM Helper
class DOMHelper {
  static getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  static setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }

  static setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  static updateDimensionDisplay(dimension, value) {
    this.setValue(dimension, value);
    this.setText(`${dimension}Value`, value);
  }

  static updateVolumeDisplay(inputId, displayId, value, decimals = 1) {
    this.setValue(inputId, value);
    this.setText(displayId, value.toFixed(decimals));
  }
}

// Utility functions
function formatNumber(num, decimals = 1) {
  return Number(num.toFixed(decimals)).toLocaleString();
}

function formatWeight(lbs, kg) {
  return `${formatNumber(lbs)} lbs (${formatNumber(kg)} kg)`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getValues(obj) {
  return Object.values(obj);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Main Application Class
class AquariumApp {
  constructor() {
    this.calculator = new TankCalculator();
    this.recommender = new GlassRecommender();
    this.equipmentRecommender = new EquipmentRecommender();
    this.currentUnitSystem = DEFAULT_VALUES.UNIT_SYSTEM;
    this.volumeUnitSystem = DEFAULT_VALUES.VOLUME_UNIT;
    this.waterType = 'freshwater';
    this.updateTimeout = null;

    this.init();
  }

  init() {
    this.setupDimensionControls();
    this.setupUnitSystem();
    this.setupWaterTypeControls();
    this.setupTankPresets();

    this.updateCalculations();
    console.log('Aquarium Tank Simulator initialized');
  }

  setupDimensionControls() {
    ['width', 'length', 'height'].forEach(dimension => {
      const input = document.getElementById(dimension);
      const valueDisplay = document.getElementById(`${dimension}Value`);

      if (!input || !valueDisplay) return;

      input.addEventListener('input', e => {
        const value = parseFloat(e.target.value);
        DOMHelper.setText(`${dimension}Value`, value);
        this.debouncedUpdate();
      });

      DOMHelper.setText(`${dimension}Value`, input.value);
    });
  }

  setupUnitSystem() {
    const unitSelector = document.getElementById('unitSystem');
    if (unitSelector) {
      unitSelector.addEventListener('change', e => {
        this.switchUnitSystem(e.target.value);
      });
    }

    this.updateUnitDisplays();
  }

  setupWaterTypeControls() {
    const waterTypeSelect = document.getElementById('waterType');
    if (waterTypeSelect) {
      waterTypeSelect.addEventListener('change', e => {
        this.waterType = e.target.value;
        this.updateCalculations();
      });
    }
  }

  setupTankPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
      button.addEventListener('click', e => {
        const btn = e.target.closest('.preset-btn');
        const width = parseInt(btn.dataset.width);
        const length = parseInt(btn.dataset.length);
        const height = parseInt(btn.dataset.height);

        if (isNaN(width) || isNaN(length) || isNaN(height)) return;

        this.setAllDimensions(width, length, height);
        this.updateCalculations();

        // Visual feedback
        btn.style.background = '#4CAF50';
        setTimeout(() => {
          btn.style.background = '#667eea';
        }, 600);
      });
    });
  }

  switchUnitSystem(newSystem) {
    if (newSystem === this.currentUnitSystem) return;

    this.currentUnitSystem = newSystem;
    this.convertDimensionValues();
    this.updateUnitDisplays();
    this.updateCalculations();
  }

  convertDimensionValues() {
    ['width', 'length', 'height'].forEach(dimension => {
      let currentValue = parseFloat(DOMHelper.getValue(dimension));
      if (isNaN(currentValue)) return;

      if (this.currentUnitSystem === UNIT_SYSTEMS.METRIC) {
        currentValue = currentValue * CONVERSIONS.INCHES_TO_CM;
      } else {
        currentValue = currentValue / CONVERSIONS.INCHES_TO_CM;
      }

      DOMHelper.updateDimensionDisplay(dimension, Math.round(currentValue));
    });
  }

  updateUnitDisplays() {
    const unit = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 'in' : 'cm';
    ['widthUnit', 'lengthUnit', 'heightUnit'].forEach(displayId => {
      DOMHelper.setText(displayId, unit);
    });
  }

  setAllDimensions(width, length, height) {
    DOMHelper.updateDimensionDisplay('width', width);
    DOMHelper.updateDimensionDisplay('length', length);
    DOMHelper.updateDimensionDisplay('height', height);
  }

  getTankDimensions() {
    return {
      width: parseFloat(DOMHelper.getValue('width')),
      length: parseFloat(DOMHelper.getValue('length')),
      height: parseFloat(DOMHelper.getValue('height')),
    };
  }

  updateCalculations() {
    const dimensions = this.getTankDimensions();
    if (!dimensions.width || !dimensions.length || !dimensions.height) return;

    const volumeData = this.calculateVolumeData(dimensions);
    const surfaceArea = this.calculator.calculateSurfaceArea(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const glassRecommendation = this.recommender.getRecommendation(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const detailedRecommendation = this.recommender.getDetailedRecommendation(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );

    // Update displays
    this.updateVolumeDisplays(volumeData);
    this.updateSurfaceAreaDisplay(surfaceArea);
    this.updateWaterWeightDisplay(volumeData.waterGallons);
    this.updateGlassDisplay(glassRecommendation, detailedRecommendation);
    this.updateEquipmentRecommendations(dimensions, volumeData.gallons, surfaceArea);
  }

  calculateVolumeData(dimensions) {
    const liters = this.calculator.calculateVolume(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const gallons = this.calculator.convertToGallons(liters);
    const waterLiters = this.calculator.adjustForDisplacement(liters);
    const waterGallons = this.calculator.convertToGallons(waterLiters);

    return { liters, gallons, waterLiters, waterGallons };
  }

  updateVolumeDisplays(volumeData) {
    if (this.volumeUnitSystem === VOLUME_UNITS.GALLONS) {
      DOMHelper.updateVolumeDisplay('volumeInput', 'volumeValue', volumeData.gallons);
      DOMHelper.updateVolumeDisplay(
        'waterVolumeInput',
        'waterVolumeValue',
        volumeData.waterGallons
      );
    } else {
      DOMHelper.updateVolumeDisplay('volumeInput', 'volumeValue', volumeData.liters);
      DOMHelper.updateVolumeDisplay('waterVolumeInput', 'waterVolumeValue', volumeData.waterLiters);
    }
  }

  updateSurfaceAreaDisplay(surfaceArea) {
    const topSqFt = formatNumber(surfaceArea.topSqFt, 1);
    const topSqIn = Math.round(surfaceArea.topSqIn);

    DOMHelper.setText('surfaceAreaResult', `${topSqFt} ft² (${topSqIn} in²)`);

    const indicator = document.getElementById('surfaceAreaText');
    if (indicator) {
      if (surfaceArea.topSqFt < 2) {
        indicator.textContent = 'Low oxygen exchange';
      } else if (surfaceArea.topSqFt < 4) {
        indicator.textContent = 'Good oxygen exchange';
      } else {
        indicator.textContent = 'Excellent oxygen exchange';
      }
    }
  }

  updateWaterWeightDisplay(waterGallons) {
    const weightData = this.calculator.calculateWaterWeight(
      waterGallons,
      this.waterType === 'saltwater'
    );
    DOMHelper.setText('waterWeightResult', formatWeight(weightData.lbs, weightData.kg));
  }

  updateGlassDisplay(thickness, detailed) {
    DOMHelper.setText('glassResult', thickness);
    DOMHelper.setText('glassNotes', detailed.safetyNote);
  }

  updateEquipmentRecommendations(dimensions, volumeGallons, surfaceArea) {
    const recommendations = this.equipmentRecommender.getAllRecommendations(
      dimensions.length,
      dimensions.width,
      dimensions.height,
      volumeGallons,
      surfaceArea
    );

    DOMHelper.setText('filterRecommendation', recommendations.filter);
    DOMHelper.setText('heaterRecommendation', recommendations.heater);
    DOMHelper.setText('chillerRecommendation', recommendations.chiller);
    DOMHelper.setText('airPumpRecommendation', recommendations.airPump);
    DOMHelper.setText('thermometerRecommendation', recommendations.thermometer);
    DOMHelper.setText('circulationPumpRecommendation', recommendations.circulationPump);
    DOMHelper.setText('atoRecommendation', recommendations.ato);
    DOMHelper.setText('uvSterilizerRecommendation', recommendations.uvSterilizer);
  }

  debouncedUpdate() {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.updateCalculations();
    }, 300);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Aquarium Tank Simulator...');
  window.app = new AquariumApp();
});

console.log('Aquarium Tank Simulator bundle loaded');
