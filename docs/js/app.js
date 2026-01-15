// Main application entry point
import { TankCalculator } from '../src/domain/calculations/TankCalculator.js';
import { GlassRecommender } from '../src/domain/recommendations/GlassRecommender.js';
import { EquipmentRecommender } from '../src/domain/recommendations/EquipmentRecommender.js';
import {
  GlassPanelCalculator,
  WeightDistributionCalculator,
} from '../src/domain/calculations/GlassPanelCalculator.js';
import { DOMHelper } from '../src/ui/utils/DOMHelper.js';
import {
  CONVERSIONS,
  UNIT_SYSTEMS,
  VOLUME_UNITS,
  DIMENSIONS,
  DEFAULT_VALUES,
  loadConstantsFromJSON,
} from '../src/config/constants.js';
import {
  escapeHtml,
  clamp,
  formatNumber,
  formatWeight,
  debounce,
  showError,
  showWarning,
  createButton,
  createSelect,
} from '../src/utils/formatters.js';
import { PlacementGuide } from '../src/domain/recommendations/PlacementGuide.js';
import { DimensionFinder } from '../src/domain/calculations/DimensionFinder.js';
import {
  createVolumeChart,
  createWeightChart,
  createGlassThicknessChart,
} from '../src/ui/visualizations/charts/charts.js';
import {
  debounceFunction,
  deepClone,
  clamp,
  getValues,
  orderBy,
  filterArray,
  mapArray,
  max,
} from '../src/utils/lodash-utils.js';
import { saveJSON, saveCanvas, generateTimestampedFilename } from '../src/utils/file-saver.js';
import { showFormModal, openCustomModal } from '../src/utils/modal.js';
import { logger } from '../src/utils/logger.js';

class AquariumApp {
  constructor() {
    // Initialize with defaults first
    this.calculator = new TankCalculator();
    this.recommender = new GlassRecommender();
    this.equipmentRecommender = new EquipmentRecommender();
    this.glassPanelCalculator = new GlassPanelCalculator(this.recommender);
    this.weightDistributionCalculator = new WeightDistributionCalculator();
    this.placementGuide = new PlacementGuide();
    this.dimensionFinder = new DimensionFinder();
    this.currentUnitSystem = DEFAULT_VALUES.UNIT_SYSTEM;
    this.volumeUnitSystem = DEFAULT_VALUES.VOLUME_UNIT;
    this.waterType = 'freshwater';
    this.supportPoints = 4;
    this.updateTimeout = null;
    this.updatingFromVolume = false;
    this.fixedVolumeMode = false;
    this.ratioLocked = false;
    this.aspectRatio = { width: 1, length: 1, height: 1 };
    this.activeDimension = null;

    // Preload JSON data after initialization
    this.preloadData();

    this.init();
  }

  async preloadData() {
    try {
      await loadConstantsFromJSON();
      logger.log('All JSON data preloaded successfully');
    } catch (error) {
      logger.error('Failed to preload data:', error);
    }
  }

  getParsedDimensions() {
    return {
      width: parseFloat(DOMHelper.getValue('width')),
      length: parseFloat(DOMHelper.getValue('length')),
      height: parseFloat(DOMHelper.getValue('height')),
    };
  }

  convertToCurrentUnitSystem(value) {
    return this.currentUnitSystem === UNIT_SYSTEMS.METRIC
      ? value / CONVERSIONS.INCHES_TO_CM
      : value;
  }

  convertFromCurrentUnitSystem(value) {
    return this.currentUnitSystem === UNIT_SYSTEMS.METRIC
      ? value * CONVERSIONS.INCHES_TO_CM
      : value;
  }

  updatePanelElement(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = text;
  }

  init() {
    this.setupDimensionControls();
    this.setupVolumeInputs();
    this.setupWaterLevelControl();
    this.setupUnitSystem();
    this.setupVolumeUnitSystem();
    this.setupTankPresets();
    this.setupCalculationModeToggle();
    this.setupWaterTypeControls();
    this.setupCopyButton();
    this.setupRatioLock();
    this.setupExportButtons();
    this.setupWeightDistributionControls();
    this.setupSaveLoadConfigurations();
    this.setupDimensionFinder();

    this.updateCalculations();
    this.updatePlacementGuide();
    this.renderSavedConfigurations();

    logger.log('Aquarium Tank Simulator initialized');
  }

  setupDimensionControls() {
    const dimensions = getValues(DIMENSIONS);

    dimensions.forEach(dim => {
      const input = document.getElementById(dim);
      const valueDisplay = document.getElementById(`${dim}Value`);

      if (!input || !valueDisplay) {
        logger.error(`Missing DOM elements for ${dim}`);
        return;
      }

      input.addEventListener('mousedown', () => {
        this.activeDimension = dim;
        if (this.ratioLocked) {
          this.storeAspectRatio();
        }
      });

      input.addEventListener('input', e => {
        const value = parseFloat(e.target.value);
        DOMHelper.setText(`${dim}Value`, value);
        this.clearInputError(dim);
        this.updatingFromVolume = false;

        if (this.ratioLocked && this.activeDimension === dim) {
          this.scaleOtherDimensions(dim, value);
        }

        this.debouncedUpdate();
      });

      input.addEventListener('change', e => {
        const value = parseFloat(e.target.value);
        const min = parseFloat(e.target.min);
        const max = parseFloat(e.target.max);

        if (value < min || value > max) {
          this.showInputError(dim, `Value must be between ${min} and ${max}`);
        } else {
          this.clearInputError(dim);
        }
      });

      DOMHelper.setText(`${dim}Value`, input.value);
    });
  }

  setupWaterLevelControl() {
    const waterLevelInput = document.getElementById('waterLevel');
    const waterLevelValue = document.getElementById('waterLevelValue');

    if (waterLevelInput && waterLevelValue) {
      waterLevelInput.addEventListener('input', e => {
        const value = parseFloat(e.target.value);
        DOMHelper.setText('waterLevelValue', value);

        this.debouncedUpdate();
      });

      DOMHelper.setText('waterLevelValue', waterLevelInput.value);
    }
  }

  setupVolumeInputs() {
    const volumeInput = document.getElementById('volumeInput');
    const waterVolumeInput = document.getElementById('waterVolumeInput');

    if (!volumeInput || !waterVolumeInput) {
      logger.error('Volume input elements not found');
      return;
    }

    this.setupVolumeInput(volumeInput, 'volumeValue', 'total');
    this.setupVolumeInput(waterVolumeInput, 'waterVolumeValue', 'water');
  }

  setupVolumeInput(input, valueDisplayId, volumeType) {
    input.addEventListener('input', e => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        document.getElementById(valueDisplayId).textContent = formatNumber(value, 1);
        this.updatingFromVolume = true;
        this.adjustDimensionsForVolume(volumeType, value, this.volumeUnitSystem);
      }
    });
  }

  adjustDimensionsForVolume(type, volume) {
    let width, length, height;

    let volumeLiters;
    if (type === 'volume') {
      volumeLiters = volume / CONVERSIONS.GALLONS_TO_LITERS;
    } else if (type === 'waterVolume') {
      volumeLiters =
        volume / CONVERSIONS.GALLONS_TO_LITERS / (1 - CONVERSIONS.DISPLACEMENT_PERCENT);
    }

    const volumeCm3 = volumeLiters * 1000;

    const targetRatio = {
      width: 1,
      length: 1.5,
      height: 1,
    };

    const totalRatio = targetRatio.width + targetRatio.length + targetRatio.height;
    const volumeCm3PerRatioUnit = volumeCm3 / (totalRatio * totalRatio * totalRatio);

    width = Math.round(
      Math.cbrt(volumeCm3PerRatioUnit * targetRatio.width * totalRatio * totalRatio)
    );
    length = Math.round(
      Math.cbrt(volumeCm3PerRatioUnit * targetRatio.length * totalRatio * totalRatio)
    );
    height = Math.round(
      Math.cbrt(volumeCm3PerRatioUnit * targetRatio.height * totalRatio * totalRatio)
    );

    if (this.currentUnitSystem === UNIT_SYSTEMS.METRIC) {
      width = this.convertFromCurrentUnitSystem(width);
      length = this.convertFromCurrentUnitSystem(length);
      height = this.convertFromCurrentUnitSystem(height);
    }
  }

  clampDimension(cm) {
    const minCm = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 25.4 : 25;
    const maxCm = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 304.8 : 305;
    return clamp(cm, minCm, maxCm);
  }

  setupUnitSystem() {
    const unitSelector = document.getElementById('unitSystem');

    unitSelector.addEventListener('change', e => {
      this.switchUnitSystem(e.target.value);
    });

    this.updateUnitDisplays();
    this.updatePresetLabels();
  }

  setupVolumeUnitSystem() {
    const volumeUnitSelector = document.getElementById('volumeUnit');

    if (volumeUnitSelector) {
      volumeUnitSelector.addEventListener('change', e => {
        this.volumeUnitSystem = e.target.value;
        this.updateVolumeUnitDisplays();
        this.updatePresetLabels();
        this.updateCalculations(true);
      });

      volumeUnitSelector.value = this.volumeUnitSystem;
      this.updateVolumeUnitDisplays();
      this.updatePresetLabels();
    }
  }

  updateVolumeUnitDisplays() {
    const volumeInputUnit = document.getElementById('volumeInputUnit');
    const waterVolumeInputUnit = document.getElementById('waterVolumeInputUnit');

    if (volumeInputUnit) {
      volumeInputUnit.textContent = this.volumeUnitSystem === 'gallons' ? 'gal' : 'L';
    }

    if (waterVolumeInputUnit) {
      waterVolumeInputUnit.textContent = this.volumeUnitSystem === 'gallons' ? 'gal' : 'L';
    }

    this.updateDimensionFinderUnitDisplay();
  }

  setupTankPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');

    presetButtons.forEach(button => {
      button.addEventListener('click', e => {
        this.showLoadingState();

        const button = e.target.closest('.preset-btn');
        const width = parseInt(button.dataset.width);
        const length = parseInt(button.dataset.length);
        const height = parseInt(button.dataset.height);

        if (isNaN(width) || isNaN(length) || isNaN(height)) {
          logger.error('Invalid preset dimensions');
          this.hideLoadingState();
          return;
        }

        this.setAllDimensions(width, length, height);
        getValues(DIMENSIONS).forEach(dim => this.clearInputError(dim));

        button.classList.add('success-animation');
        button.style.background = '#4CAF50';
        button.style.transform = 'scale(1.05)';

        setTimeout(() => {
          this.updateCalculations(true);
          this.hideLoadingState();

          setTimeout(() => {
            button.classList.remove('success-animation');
            button.style.background = '#667eea';
            button.style.transform = 'scale(1)';
          }, 600);
        }, 100);
      });
    });
  }

  switchUnitSystem(newSystem) {
    if (newSystem === this.currentUnitSystem) return;

    const oldSystem = this.currentUnitSystem;
    this.currentUnitSystem = newSystem;

    this.convertDimensionValues(oldSystem, newSystem);
    this.updateUnitDisplays();
    this.updateDimensionRanges();
    this.updatePresetLabels();
    this.updateCalculations(true);

    logger.log(`Switched from ${oldSystem} to ${newSystem} units`);
  }

  convertDimensionValues(fromSystem, toSystem) {
    const dimensions = getValues(DIMENSIONS);

    dimensions.forEach(dim => {
      let currentValue = parseFloat(DOMHelper.getValue(dim));

      if (isNaN(currentValue)) return;

      currentValue = this.convertUnit(currentValue, fromSystem, toSystem);
      currentValue = Math.round(currentValue);
      DOMHelper.updateDimensionDisplay(dim, currentValue);
    });
  }

  convertUnit(value, fromSystem, toSystem) {
    if (fromSystem === toSystem) return value;

    if (fromSystem === UNIT_SYSTEMS.IMPERIAL && toSystem === UNIT_SYSTEMS.METRIC) {
      return value * CONVERSIONS.INCHES_TO_CM;
    } else if (fromSystem === UNIT_SYSTEMS.METRIC && toSystem === UNIT_SYSTEMS.IMPERIAL) {
      return value / CONVERSIONS.INCHES_TO_CM;
    }

    return value;
  }

  updateUnitDisplays() {
    const unitDisplays = ['widthUnit', 'lengthUnit', 'heightUnit'];
    const unit = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 'in' : 'cm';

    unitDisplays.forEach(displayId => {
      DOMHelper.setText(displayId, unit);
    });
  }

  updateDimensionRanges() {
    const dimensions = getValues(DIMENSIONS);
    const ranges = {
      [UNIT_SYSTEMS.IMPERIAL]: { min: 10, max: 120, step: 1 },
      [UNIT_SYSTEMS.METRIC]: { min: 25, max: 305, step: 5 },
    };

    const range = ranges[this.currentUnitSystem];

    dimensions.forEach(dim => {
      const input = DOMHelper.getElement(dim);
      input.min = range.min;
      input.max = range.max;
      input.step = range.step;

      let currentValue = parseFloat(input.value);
      currentValue = clamp(currentValue, range.min, range.max);
      DOMHelper.updateDimensionDisplay(dim, currentValue);
    });
  }

  updateCalculations(forceUpdateVolume = false) {
    const dimensions = this.getTankDimensions();
    if (!dimensions) {
      logger.error('Invalid dimension values detected');
      return;
    }

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

    // Calculate glass panels
    const panels = this.glassPanelCalculator.calculatePanels(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    const glassWeightTotal = this.glassPanelCalculator.getTotalGlassWeight(panels);

    // Calculate weight distribution
    const isSaltwater = this.waterType === 'saltwater';
    const totalWeight = this.weightDistributionCalculator.calculateTotalWeight(
      volumeData.waterGallons,
      isSaltwater,
      parseFloat(glassWeightTotal.lbs)
    );

    // Update all displays
    this.updateVolumeDisplays(
      volumeData.liters,
      volumeData.gallons,
      volumeData.waterLiters,
      forceUpdateVolume
    );
    this.updateSurfaceAreaDisplay(surfaceArea);
    this.updateWaterWeightDisplay(volumeData.waterGallons);
    this.updateGlassPanelsDisplay(panels);
    this.updateWeightDistributionDisplay(totalWeight);
    this.updatePlacementGuide();
    DOMHelper.setText('glassResult', glassRecommendation);
    DOMHelper.setText(
      'glassNotes',
      detailedRecommendation?.safetyNote || 'Standard aquarium glass recommended'
    );

    this.updateEquipmentRecommendations(
      dimensions.length,
      dimensions.width,
      dimensions.height,
      volumeData.gallons,
      surfaceArea
    );

    // Update visualizations
    this.updateVisualizations(volumeData, totalWeight, panels);
  }

  updateVisualizations(volumeData, totalWeight, panels) {
    try {
      // Create volume chart
      const volumeChartContainer = document.getElementById('volume-chart');
      if (volumeChartContainer && volumeData) {
        const chartData = {
          geometricGallons: volumeData.gallons || volumeData.geometricGallons || 0,
          waterGallons: volumeData.waterGallons || 0,
        };
        createVolumeChart('#volume-chart', chartData);
      }

      // Create weight chart
      const weightChartContainer = document.getElementById('weight-chart');
      if (weightChartContainer && totalWeight) {
        const weightChartData = {
          waterLbs: parseFloat(totalWeight.waterLbs) || 0,
          glassLbs: parseFloat(totalWeight.glassLbs) || 0,
        };
        createWeightChart('#weight-chart', weightChartData);
      }

      // Create glass thickness chart
      const thicknessChartContainer = document.getElementById('thickness-chart');
      if (thicknessChartContainer && panels) {
        createGlassThicknessChart('#thickness-chart', panels);
      }
    } catch (error) {
      logger.error('Error updating visualizations:', error);
    }
  }

  getTankDimensions() {
    const dimensions = this.getParsedDimensions();

    return {
      width: this.convertToCurrentUnitSystem(dimensions.width),
      length: this.convertToCurrentUnitSystem(dimensions.length),
      height: this.convertToCurrentUnitSystem(dimensions.height),
    };
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

  updateVisualizer(dimensions) {
    try {
    } catch (error) {
      logger.error('Failed to update visualizer:', error);
    }
  }

  updatePlacementGuide() {
    const dimensions = this.getTankDimensions();
    const volumeData = this.calculateVolumeData(dimensions);
    const totalWeight = document.getElementById('totalWeight');

    if (!dimensions || !totalWeight) return;

    const weightText = totalWeight.textContent;
    const weightLbs = parseFloat(weightText.split(' ')[0]);

    const recommendations = this.placementGuide.getRecommendations(
      dimensions,
      volumeData.gallons,
      weightLbs
    );

    this.displayPlacementRecommendations(recommendations);
    this.displayPlacementTips(dimensions, volumeData.gallons, weightLbs);
  }

  displayPlacementRecommendations(recommendations) {
    DOMHelper.batchUpdate({
      roomTypeRecommendation: recommendations.roomType,
      locationRecommendation: recommendations.location,
      powerRecommendation: recommendations.power,
      lightingRecommendation: recommendations.lighting,
      accessRecommendation: recommendations.access,
      spacingRecommendation: recommendations.spacing,
    });
  }

  displayPlacementTips(dimensions, volume, weightLbs) {
    const maxDimension = max([dimensions.width, dimensions.length, dimensions.height]);
    const tips = this.placementGuide.getTips(maxDimension, volume, weightLbs, dimensions.length);
    const tipsEl = document.getElementById('placementTips');
    if (tipsEl) {
      tipsEl.innerHTML =
        '<h4>Additional Tips</h4><ul>' +
        mapArray(tips, tip => `<li>${escapeHtml(tip)}</li>`).join('') +
        '</ul>';
    }
  }

  updateVolumeDisplays(liters, gallons, waterLiters, forceUpdate = false) {
    const waterGallons = this.calculator.convertToGallons(waterLiters);

    if (forceUpdate || !this.updatingFromVolume) {
      if (this.volumeUnitSystem === VOLUME_UNITS.GALLONS) {
        this.updateVolumeInput('volumeInput', 'volumeValue', gallons, 500);
        this.updateVolumeInput('waterVolumeInput', 'waterVolumeValue', waterGallons, 500);
      } else {
        this.updateVolumeInput('volumeInput', 'volumeValue', liters, 2000);
        this.updateVolumeInput('waterVolumeInput', 'waterVolumeValue', waterLiters, 2000);
      }
    }
  }

  updateVolumeInput(inputId, valueDisplayId, value, maxValue) {
    DOMHelper.updateVolumeDisplay(inputId, valueDisplayId, value, 1);
    DOMHelper.getElement(inputId).max = maxValue;
  }

  updateEquipmentRecommendations(length, width, height, volumeGallons, surfaceArea) {
    const recommendations = this.equipmentRecommender.getAllRecommendations(
      length,
      width,
      height,
      volumeGallons,
      surfaceArea
    );

    if (!recommendations) {
      logger.error('Failed to get equipment recommendations');
      return;
    }

    const updates = {
      filterRecommendation: recommendations.filter || '--',
      heaterRecommendation: recommendations.heater || '--',
      chillerRecommendation: recommendations.chiller || '--',
      uvSterilizerRecommendation: recommendations.uvSterilizer || '--',
      airPumpRecommendation: recommendations.airPump || '--',
      thermometerRecommendation: recommendations.thermometer || '--',
      circulationPumpRecommendation: recommendations.circulationPump || '--',
      atoRecommendation: recommendations.ato || '--',
    };

    DOMHelper.batchUpdate(updates);
  }

  updateSurfaceAreaDisplay(surfaceArea) {
    const surfaceAreaEl = document.getElementById('surfaceAreaResult');
    const indicator = document.getElementById('surfaceAreaIndicator');
    const indicatorText = document.getElementById('surfaceAreaText');

    if (!surfaceAreaEl || !indicator || !indicatorText) return;

    const topSqFt = formatNumber(surfaceArea.topSqFt, 1);
    const topSqIn = Math.round(surfaceArea.topSqIn);

    surfaceAreaEl.textContent = `${topSqFt} ft² (${topSqIn} in²)`;

    const topArea = surfaceArea.topSqFt;

    indicator.className = 'surface-area-indicator';

    if (topArea < 2) {
      indicator.classList.add('surface-area-poor');
      indicatorText.textContent = 'Low oxygen exchange';
    } else if (topArea < 4) {
      indicator.classList.add('surface-area-good');
      indicatorText.textContent = 'Good oxygen exchange';
    } else {
      indicator.classList.add('surface-area-excellent');
      indicatorText.textContent = 'Excellent oxygen exchange';
    }
  }

  updateWaterWeightDisplay(waterGallons) {
    const waterWeightEl = document.getElementById('waterWeightResult');

    if (!waterWeightEl) return;

    const isSaltwater = this.waterType === 'saltwater';
    const weightData = this.calculator.calculateWaterWeight(waterGallons, isSaltwater);

    waterWeightEl.textContent = formatWeight(weightData.lbs, weightData.kg);
  }

  updateGlassPanelsDisplay(panels) {
    const panelNames = ['front', 'back', 'left', 'right', 'bottom'];

    panelNames.forEach(panel => {
      const panelData = panels[panel];
      const config = {
        size: `${panelData.width}"×${panelData.height}"`,
        thickness: `${panelData.thicknessMm}mm`,
        area: `${panelData.areaSqFt} ft²`,
        weight: `${panelData.weightLbs} lbs`,
      };

      this.updatePanelElement(`${panel}PanelSize`, config.size);
      this.updatePanelElement(`${panel}PanelThickness`, config.thickness);
      this.updatePanelElement(`${panel}PanelArea`, config.area);
      this.updatePanelElement(`${panel}PanelWeight`, config.weight);
    });

    // Update total glass weight
    const totalWeightEl = document.getElementById('totalGlassWeight');
    const glassWeightTotal = this.glassPanelCalculator.getTotalGlassWeight(panels);
    if (totalWeightEl) {
      this.setWeightDisplay(totalWeightEl, glassWeightTotal.lbs, glassWeightTotal.kg);
    }
  }

  updateWeightDistributionDisplay(totalWeight) {
    const totalWeightEl = document.getElementById('totalWeight');
    const weightPerPointEl = document.getElementById('weightPerPoint');
    const configEl = document.getElementById('supportConfiguration');
    const waterWeightEl = document.getElementById('waterWeightBreakdown');
    const glassWeightEl = document.getElementById('glassWeightBreakdown');
    const recommendationsEl = document.getElementById('supportRecommendations');

    if (!totalWeightEl) return;

    this.setWeightDisplay(totalWeightEl, totalWeight.totalLbs, totalWeight.totalKg);

    // Calculate weight per support point
    const distribution = this.weightDistributionCalculator.calculateDistribution(
      parseFloat(totalWeight.totalLbs),
      this.supportPoints
    );

    if (weightPerPointEl) {
      weightPerPointEl.textContent = `${formatNumber(distribution.weightPerPoint, 1)} lbs`;
    }

    if (configEl) {
      configEl.textContent = distribution.description;
    }

    // Update breakdown
    if (waterWeightEl) {
      this.setWeightDisplay(waterWeightEl, totalWeight.waterLbs, totalWeight.waterKg);
    }

    if (glassWeightEl) {
      this.setWeightDisplay(glassWeightEl, totalWeight.glassLbs, totalWeight.glassKg);
    }

    // Update recommendations
    if (recommendationsEl) {
      recommendationsEl.innerHTML = '';
      const lengthIn = parseFloat(DOMHelper.getValue('length'));
      const widthIn = parseFloat(DOMHelper.getValue('width'));
      const recommendations = this.weightDistributionCalculator.getSupportRecommendations(
        parseFloat(totalWeight.totalLbs),
        lengthIn,
        widthIn
      );

      recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = `recommendation-item ${rec.type}`;
        div.textContent = rec.message;
        recommendationsEl.appendChild(div);
      });
    }
  }

  debouncedUpdate() {
    this.updateTimeout = debounce(() => {
      this.updateCalculations();
    }, 300)();
  }

  showInputError(dimension, message) {
    const input = document.getElementById(dimension);
    const errorElement = document.getElementById(`${dimension}Error`);

    input.classList.add('input-error', 'error-animation');
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
      input.classList.remove('error-animation');
    }, 500);
  }

  clearInputError(dimension) {
    const input = document.getElementById(dimension);
    const errorElement = document.getElementById(`${dimension}Error`);

    input.classList.remove('input-error');
    errorElement.style.display = 'none';
  }

  showLoadingState() {
    this.setLoadingState(true);
  }

  hideLoadingState() {
    this.setLoadingState(false);
  }

  setLoadingState(loading) {
    const resultsSections = document.querySelectorAll('.results-section, .equipment-section');
    resultsSections.forEach(section => {
      loading ? section.classList.add('loading') : section.classList.remove('loading');
    });
  }

  setupCalculationModeToggle() {
    const fixedVolumeCheckbox = document.getElementById('fixedVolumeMode');

    if (fixedVolumeCheckbox) {
      fixedVolumeCheckbox.addEventListener('change', e => {
        this.fixedVolumeMode = e.target.checked;
        this.updateControlStates();
      });
    }

    this.updateControlStates();
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

  setupCopyButton() {
    const copyBtn = document.getElementById('copySpecsBtn');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copySpecifications();
      });
    }
  }

  setupRatioLock() {
    const ratioLockCheckbox = document.getElementById('ratioLock');

    if (ratioLockCheckbox) {
      ratioLockCheckbox.addEventListener('change', e => {
        this.ratioLocked = e.target.checked;
        if (this.ratioLocked) {
          this.storeAspectRatio();
        }
      });
    }
  }

  setupExportButtons() {
    const exportSummaryBtn = document.getElementById('exportSummaryBtn');

    if (exportSummaryBtn) {
      exportSummaryBtn.addEventListener('click', () => {
        this.exportSummary();
      });
    }
  }

  setupWeightDistributionControls() {
    const supportPointsSelect = document.getElementById('supportPoints');

    if (supportPointsSelect) {
      supportPointsSelect.addEventListener('change', e => {
        this.supportPoints = parseInt(e.target.value);
        this.updateCalculations();
      });
    }
  }

  setupSaveLoadConfigurations() {
    const saveBtn = document.getElementById('saveConfigBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const exportBtn = document.getElementById('exportConfigsBtn');
    const importBtn = document.getElementById('importConfigsBtn');
    const importFileInput = document.getElementById('importConfigFile');
    const privacyLink = document.getElementById('privacyPolicyLink');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.showSaveDialog();
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all saved configurations?')) {
          this.clearAllConfigurations();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportConfigurations();
      });
    }

    if (importBtn) {
      importBtn.addEventListener('click', () => {
        importFileInput.click();
      });
    }

    if (importFileInput) {
      importFileInput.addEventListener('change', e => {
        this.importConfigurations(e.target);
      });
    }

    if (privacyLink) {
      privacyLink.addEventListener('click', e => {
        e.preventDefault();
        this.showPrivacyPolicy();
      });
    }
  }

  setupDimensionFinder() {
    const findBtn = document.getElementById('findDimensionsBtn');
    const targetVolumeInput = document.getElementById('targetVolumeInput');

    if (findBtn && targetVolumeInput) {
      findBtn.addEventListener('click', () => {
        this.findDimensionsForVolume();
      });

      targetVolumeInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          this.findDimensionsForVolume();
        }
      });

      this.updateDimensionFinderUnitDisplay();
    }
  }

  updateDimensionFinderUnitDisplay() {
    const targetVolumeUnit = document.getElementById('targetVolumeUnit');
    if (targetVolumeUnit) {
      targetVolumeUnit.textContent = this.volumeUnitSystem === 'gallons' ? 'gal' : 'L';
    }
  }

  showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('slide-out');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  showSaveDialog() {
    const modalId = 'save-config-modal';

    showFormModal({
      modalId,
      title: 'Save Configuration',
      fields: [
        {
          id: 'configNameInput',
          label: 'Configuration Name',
          type: 'text',
          placeholder: 'Enter a name for this setup...',
          required: true,
          maxlength: 50,
        },
      ],
      submitText: 'Save',
      cancelText: 'Cancel',
      onSubmit: formData => {
        this.handleSaveConfiguration(formData.configNameInput);
      },
      onCancel: () => {
        // Modal closes automatically
      },
    });

    setTimeout(() => {
      const input = document.getElementById('configNameInput');
      if (input) {
        input.focus();
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        });
      }
    }, 100);
  }

  saveConfiguration(name) {
    // Sanitize the name to prevent XSS
    const sanitizedName = this.escapeHtml(name).substring(0, 50); // Limit length

    const config = {
      id: Date.now(),
      name: sanitizedName,
      width: parseFloat(DOMHelper.getValue('width')),
      length: parseFloat(DOMHelper.getValue('length')),
      height: parseFloat(DOMHelper.getValue('height')),
      unitSystem: this.currentUnitSystem,
      volumeUnit: this.volumeUnitSystem,
      waterType: this.waterType,
      supportPoints: this.supportPoints,
      createdAt: new Date().toISOString(),
    };

    const savedConfigs = this.getSavedConfigurations();
    savedConfigs.push(config);
    try {
      localStorage.setItem('aquariumConfigs', JSON.stringify(savedConfigs));
    } catch (error) {
      console.error('Failed to save configurations to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please remove some saved configurations to make space.');
      } else {
        alert('Failed to save configurations. Please try again later.');
      }
    }

    this.renderSavedConfigurations();

    const saveBtn = document.getElementById('saveConfigBtn');
    saveBtn.classList.add('copied');
    setTimeout(() => saveBtn.classList.remove('copied'), 2000);
  }

  getSavedConfigurations() {
    let saved;
    try {
      saved = localStorage.getItem('aquariumConfigs');
    } catch (error) {
      console.error('Failed to get configurations from localStorage:', error);
      return [];
    }

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse configurations from localStorage:', error);
      return [];
    }
  }

  loadConfiguration(id) {
    const configs = this.getSavedConfigurations();
    const config = configs.find(c => c.id === id);

    if (config) {
      DOMHelper.updateDimensionDisplay('width', config.width);
      DOMHelper.updateDimensionDisplay('length', config.length);
      DOMHelper.updateDimensionDisplay('height', config.height);

      this.currentUnitSystem = config.unitSystem;
      this.volumeUnitSystem = config.volumeUnit;
      this.waterType = config.waterType;
      this.supportPoints = config.supportPoints;

      this.setSelectorValue('unitSystem', config.unitSystem);
      this.setSelectorValue('volumeUnit', config.volumeUnit);
      this.setSelectorValue('waterType', config.waterType);
      this.setSelectorValue('supportPoints', config.supportPoints);

      this.updateUnitDisplays();
      this.updateDimensionRanges();
      this.updateVolumeUnitDisplays();
      this.updatePresetLabels();
      this.updateCalculations(true);
    }
  }

  setSelectorValue(selectorId, value) {
    const selector = document.getElementById(selectorId);
    if (selector) {
      selector.value = value;
    }
  }

  deleteConfiguration(id, event) {
    event.stopPropagation();

    if (confirm('Delete this configuration?')) {
      const configs = this.getSavedConfigurations();
      const filtered = filterArray(configs, c => c.id !== id);
      try {
        localStorage.setItem('aquariumConfigs', JSON.stringify(filtered));
      } catch (error) {
        console.error('Failed to save configurations to localStorage after deletion:', error);
        if (error.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Please remove some saved configurations to make space.');
        } else {
          alert('Failed to save configurations. Please try again later.');
        }
      }
      this.renderSavedConfigurations();
    }
  }

  clearAllConfigurations() {
    try {
      localStorage.removeItem('aquariumConfigs');
    } catch (error) {
      console.error('Failed to remove configurations from localStorage:', error);
      alert('Failed to clear configurations. Please try again later.');
    }
    this.renderSavedConfigurations();
  }

  exportConfigurations() {
    const configs = this.getSavedConfigurations();

    if (configs.length === 0) {
      alert('No configurations to export. Save some configurations first.');
      return;
    }

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      configurations: configs,
    };

    const filename = generateTimestampedFilename('aquarium-configs', 'json');

    saveJSON(exportData, filename)
      .then(() => {
        this.showSuccess(`Exported ${configs.length} configuration(s)`);
      })
      .catch(error => {
        logger.error('Failed to export configurations:', error);
        alert('Failed to export configurations. Please try again.');
      });
  }

  importConfigurations(fileInput) {
    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.configurations || !Array.isArray(data.configurations)) {
          throw new Error('Invalid file format');
        }

        const existingConfigs = this.getSavedConfigurations();
        const importedCount = data.configurations.length;

        const mergedConfigs = [...existingConfigs, ...data.configurations];

        localStorage.setItem('aquariumConfigs', JSON.stringify(mergedConfigs));
        this.renderSavedConfigurations();

        this.showSuccess(`Imported ${importedCount} configuration(s)`);
      } catch (error) {
        logger.error('Failed to import configurations:', error);
        alert(
          'Failed to import configurations. Please ensure the file is a valid export from this application.'
        );
      } finally {
        fileInput.value = '';
      }
    };

    reader.onerror = () => {
      logger.error('Error reading file:', reader.error);
      alert('Failed to read the file. Please try again.');
      fileInput.value = '';
    };

    reader.readAsText(file);
  }

  showPrivacyPolicy() {
    const modalId = 'privacy-policy-modal';
    const content = `
        <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-800">Data Storage</h3>
            <p class="text-gray-600">This application uses <strong>localStorage</strong> to store your saved configurations locally on your device. This data never leaves your browser or is transmitted to any server.</p>

            <h3 class="text-lg font-semibold text-gray-800">What Data We Store</h3>
            <p class="text-gray-600 mb-3">We store only the following information for each saved configuration:</p>
            <ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Tank dimensions (width, length, height)</li>
                <li>Unit system preferences (imperial/metric)</li>
                <li>Volume unit preferences (gallons/liters)</li>
                <li>Water type preference (freshwater/saltwater)</li>
                <li>Support points configuration</li>
                <li>Configuration name and creation date</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-800">Privacy & Security</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>No data collection:</strong> We do not collect, track, or transmit any personal data.</li>
                <li><strong>No analytics:</strong> No third-party analytics or tracking scripts are used.</li>
                <li><strong>No cookies:</strong> We do not use cookies or any other tracking technologies.</li>
                <li><strong>Local only:</strong> All data remains on your device in your browser's local storage.</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-800">Data Management</h3>
            <p class="text-gray-600 mb-3">You have full control over your data:</p>
            <ul class="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Export:</strong> You can export all your configurations to a JSON file for backup.</li>
                <li><strong>Import:</strong> You can import previously exported configurations.</li>
                <li><strong>Delete:</strong> You can delete individual configurations or clear all data.</li>
                <li><strong>Browser Control:</strong> Clearing your browser's local storage will remove all saved configurations.</li>
            </ul>

            <h3 class="text-lg font-semibold text-gray-800">Third-Party Services</h3>
            <p class="text-gray-600">This application does not use any third-party services, APIs, or external dependencies that collect user data.</p>

            <div class="pt-4 border-t border-gray-200 mt-6">
                <p class="text-sm text-gray-500">Last updated: January 2025</p>
            </div>
        </div>
    `;

    openCustomModal(modalId, {
      title: 'Privacy Policy',
      content,
      width: 'max-w-2xl',
      onClose: () => {
        // Modal closes automatically
      },
    });
  }

  renderSavedConfigurations() {
    const configs = this.getSavedConfigurations();
    const container = document.getElementById('savedConfigsList');
    const noConfigs = document.getElementById('noSavedConfigs');

    if (!container) return;

    container.innerHTML = '';

    if (configs.length === 0) {
      const noSavedDiv = document.createElement('div');
      noSavedDiv.className = 'no-saved-configs';
      noSavedDiv.id = 'noSavedConfigs';
      noSavedDiv.innerHTML = `
                <span class="no-config-icon">📁</span>
                <span class="no-config-text">No saved configurations yet. Save your setup to get started!</span>
            `;
      container.appendChild(noSavedDiv);
      return;
    }

    orderBy(configs, ['createdAt'], ['desc']).forEach(config => {
      const card = document.createElement('div');
      card.className = 'saved-config-card';
      card.addEventListener('click', () => this.loadConfiguration(config.id));

      const date = new Date(config.createdAt);
      const dateStr =
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      card.innerHTML = `
                <div class="saved-config-card-header">
                    <span class="config-name">${this.escapeHtml(config.name)}</span>
                    <button class="config-delete-btn" title="Delete configuration">×</button>
                </div>
                <div class="saved-config-details">
                    <div class="config-detail">
                        <span class="config-detail-label">Dimensions:</span>
                        <span class="config-detail-value">${config.width}" × ${config.length}" × ${config.height}"</span>
                    </div>
                    <div class="config-detail">
                        <span class="config-detail-label">Type:</span>
                        <span class="config-detail-value">${config.waterType === 'saltwater' ? 'Saltwater' : 'Freshwater'}</span>
                    </div>
                    <div class="config-detail">
                        <span class="config-detail-label">Supports:</span>
                        <span class="config-detail-value">${config.supportPoints} points</span>
                    </div>
                </div>
                <div class="config-date">${dateStr}</div>
            `;

      const deleteBtn = card.querySelector('.config-delete-btn');
      deleteBtn.addEventListener('click', e => this.deleteConfiguration(config.id, e));

      container.appendChild(card);
    });
  }

  escapeHtml(text) {
    if (typeof text !== 'string') {
      return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent || div.innerText || '';
  }

  getExportData() {
    const width = parseFloat(DOMHelper.getValue('width'));
    const length = parseFloat(DOMHelper.getValue('length'));
    const height = parseFloat(DOMHelper.getValue('height'));

    return {
      width,
      length,
      height,
      widthCm: Math.round(width * 2.54),
      lengthCm: Math.round(length * 2.54),
      heightCm: Math.round(height * 2.54),
      volumeValue: document.getElementById('volumeValue').textContent,
      waterVolumeValue: document.getElementById('waterVolumeValue').textContent,
      volumeUnit: this.volumeUnitSystem === 'gallons' ? 'gal' : 'L',
      surfaceArea: document.getElementById('surfaceAreaResult').textContent,
      glassRec: document.getElementById('glassResult').textContent,
      glassNotes: document.getElementById('glassNotes').textContent,
      waterWeight: document.getElementById('waterWeightResult').textContent,
      glassWeight: document.getElementById('totalGlassWeight').textContent,
      totalWeight: document.getElementById('totalWeight').textContent,
      filter: document.getElementById('filterRecommendation').textContent,
      heater: document.getElementById('heaterRecommendation').textContent,
    };
  }

  handleSaveConfiguration(name) {
    if (name) {
      this.saveConfiguration(name);
    }
  }

  storeAspectRatio() {
    const { width, length, height } = this.getDimensionsAsObject();

    this.aspectRatio = {
      width: 1,
      length: length / width,
      height: height / width,
    };
  }

  getDimensionsAsObject() {
    return {
      width: parseFloat(DOMHelper.getValue('width')),
      length: parseFloat(DOMHelper.getValue('length')),
      height: parseFloat(DOMHelper.getValue('height')),
    };
  }

  setAllDimensions(width, length, height) {
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    const heightInput = document.getElementById('height');

    if (widthInput && lengthInput && heightInput) {
      widthInput.value = width;
      lengthInput.value = length;
      heightInput.value = height;

      document.getElementById('widthValue').textContent = width;
      document.getElementById('lengthValue').textContent = length;
      document.getElementById('heightValue').textContent = height;
    } else {
      logger.error('Could not find dimension input elements');
    }
  }

  scaleOtherDimensions(changedDim, newValue) {
    const scale = newValue / parseFloat(DOMHelper.getValue(changedDim));

    getValues(DIMENSIONS).forEach(dim => {
      if (dim !== changedDim) {
        const currentVal = parseFloat(DOMHelper.getValue(dim));
        const newVal = this.clampDimension(
          (currentVal * scale) /
            (this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? CONVERSIONS.INCHES_TO_CM : 1)
        );

        const displayValue =
          this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL
            ? Math.round(newVal / CONVERSIONS.INCHES_TO_CM)
            : Math.round(newVal);

        DOMHelper.updateDimensionDisplay(dim, displayValue);
      }
    });
  }

  exportSummary() {
    const data = this.getExportData();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 700;

    const gradient = ctx.createLinearGradient(0, 0, 0, 700);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 700);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐠 AQUARIUM TANK SPECIFICATIONS', 450, 60);

    ctx.font = 'bold 24px Segoe UI, sans-serif';
    ctx.textAlign = 'left';

    let y = 110;
    const lineHeight = 28;

    ctx.fillText('Dimensions:', 50, y);
    y += lineHeight;
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`  Width:  ${data.width}" (${data.widthCm} cm)`, 50, y);
    y += lineHeight;
    ctx.fillText(`  Length: ${data.length}" (${data.lengthCm} cm)`, 50, y);
    y += lineHeight;
    ctx.fillText(`  Height: ${data.height}" (${data.heightCm} cm)`, 50, y);
    y += lineHeight + 12;

    ctx.font = 'bold 24px Segoe UI, sans-serif';
    ctx.fillText('Volume:', 50, y);
    y += lineHeight;
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`  Total: ${data.volumeValue} ${data.volumeUnit}`, 50, y);
    y += lineHeight;
    ctx.fillText(`  Water: ${data.waterVolumeValue} ${data.volumeUnit}`, 50, y);
    y += lineHeight + 12;

    ctx.font = 'bold 24px Segoe UI, sans-serif';
    ctx.fillText(`Surface Area: ${data.surfaceArea}`, 50, y);
    y += lineHeight + 12;
    ctx.fillText(`Water Weight: ${data.waterWeight}`, 50, y);
    y += lineHeight;
    ctx.fillText(`Glass Weight: ${data.glassWeight}`, 50, y);
    y += lineHeight;
    ctx.fillText(`Total Weight: ${data.totalWeight}`, 50, y);
    y += lineHeight + 12;

    ctx.font = 'bold 24px Segoe UI, sans-serif';
    ctx.fillText(`Glass: ${data.glassRec}`, 50, y);
    y += lineHeight + 12;

    ctx.font = 'bold 24px Segoe UI, sans-serif';
    ctx.fillText('Equipment:', 50, y);
    y += lineHeight;
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`  Filter: ${data.filter}`, 50, y);
    y += lineHeight;
    ctx.fillText(`  Heater: ${data.heater}`, 50, y);
    y += lineHeight + 20;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    const timestamp = new Date().toLocaleString();
    ctx.fillText(`Generated: ${timestamp}`, 450, 670);

    const filename = generateTimestampedFilename('tank-summary', 'png');

    saveCanvas(canvas, filename, 'image/png').catch(error => {
      logger.error('Failed to export summary:', error);
      alert('Failed to export summary');
    });
  }

  copySpecifications() {
    const data = this.getExportData();

    const specText = `
  🐠 AQUARIUM TANK SPECIFICATIONS
  ================================
  Dimensions:
    Width:  ${data.width}" (${data.widthCm} cm)
    Length:  ${data.length}" (${data.lengthCm} cm)
    Height:  ${data.height}" (${data.heightCm} cm)

  Volume:
    Total: ${data.volumeValue} ${data.volumeUnit}
    Water: ${data.waterVolumeValue} ${data.volumeUnit}

  Surface Area: ${data.surfaceArea}
  Water Weight: ${data.waterWeight}
  Glass: ${data.glassRec}
    ${data.glassNotes}

  Equipment:
    Filter: ${data.filter}
    Heater: ${data.heater}

  Generated by Aquarium Tank Simulator
         `.trim();

    const filename = generateTimestampedFilename('tank-specs', 'txt');

    saveText(specText, filename)
      .then(() => {
        const copyBtn = document.getElementById('copySpecsBtn');
        copyBtn.classList.add('saved');
        const originalText = copyBtn.querySelector('.action-text').textContent;
        copyBtn.querySelector('.action-text').textContent = 'Saved!';

        setTimeout(() => {
          copyBtn.classList.remove('saved');
          copyBtn.querySelector('.action-text').textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        logger.error('Failed to save specifications:', err);
        alert('Failed to save specifications');
      });
  }

  updateControlStates() {
    const dimensionSliders = ['width', 'length', 'height'].map(id => document.getElementById(id));
    const volumeSliders = ['volumeInput', 'waterVolumeInput'].map(id =>
      document.getElementById(id)
    );
    const dimensionControls = document.querySelectorAll('.dimension-controls input');
    const volumeControls = document.querySelectorAll('.volume-control input');
    const resultsSection = document.querySelector('.results-section');

    if (!this.fixedVolumeMode) {
      this.setControlsEnabled(dimensionSliders, true);
      this.setControlsEnabled(volumeSliders, false);
      this.setControlsEnabled(dimensionControls, true);
      this.setControlsEnabled(volumeControls, false);

      if (resultsSection) {
        resultsSection.classList.remove('volume-mode');
      }
    } else {
      this.setControlsEnabled(dimensionSliders, false);
      this.setControlsEnabled(volumeSliders, true);
      this.setControlsEnabled(dimensionControls, false);
      this.setControlsEnabled(volumeControls, true);

      if (resultsSection) {
        resultsSection.classList.add('volume-mode');
      }
    }
  }

  setControlsEnabled(controls, enabled) {
    const opacity = enabled ? '1' : '0.5';
    const pointerEvents = enabled ? 'auto' : 'none';

    controls.forEach(control => {
      if (control) {
        control.disabled = !enabled;
        control.style.opacity = opacity;
        if (control.style.pointerEvents !== undefined) {
          control.style.pointerEvents = pointerEvents;
        }
      }
    });
  }

  setWeightDisplay(element, lbs, kg) {
    element.textContent = `${lbs} lbs (${kg} kg)`;
  }

  updatePresetLabels() {
    const presetButtons = document.querySelectorAll('.preset-btn');

    presetButtons.forEach(button => {
      const labelText = button.querySelector('.preset-label-text');

      if (labelText) {
        const labelImp = button.dataset.labelImp;
        const labelMet = button.dataset.labelMet;

        // Use different unit systems for different preset types
        if (button.classList.contains('preset-btn-dimensions')) {
          // Dimensions presets use currentUnitSystem
          if (this.currentUnitSystem === 'imperial' || !labelMet) {
            labelText.textContent = labelImp;
          } else {
            labelText.textContent = labelMet;
          }
        } else if (button.classList.contains('preset-btn-volume')) {
          // Volume presets use volumeUnitSystem
          if (this.volumeUnitSystem === 'gallons') {
            labelText.textContent = labelImp || labelMet;
          } else {
            labelText.textContent = labelMet || labelImp;
          }
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AquariumApp();
});
