// Main application entry point
import { TankVisualizer } from './tank-visualizer.js';
import { TankCalculator } from './tank-calculator.js';
import { GlassRecommender } from './glass-recommendations.js';
import { EquipmentRecommender } from './equipment-recommendations.js';
import { DOMHelper } from './dom-helper.js';
import { CONVERSIONS, UNIT_SYSTEMS, VOLUME_UNITS, DIMENSIONS, DEFAULT_VALUES } from './constants.js';

class AquariumApp {
    constructor() {
        this.visualizer = null;
        this.calculator = new TankCalculator();
        this.recommender = new GlassRecommender();
        this.equipmentRecommender = new EquipmentRecommender();
        this.currentUnitSystem = DEFAULT_VALUES.UNIT_SYSTEM;
        this.volumeUnitSystem = DEFAULT_VALUES.VOLUME_UNIT;
        this.updateTimeout = null;
        this.updatingFromVolume = false;
        this.fixedVolumeMode = false;

        this.init();
    }

    init() {
        this.setupDimensionControls();
        this.setupVolumeInputs();
        this.setupUnitSystem();
        this.setupVolumeUnitSystem();
        this.setupTankPresets();
        this.setupCalculationModeToggle();

        // Initialize visualizer after DOM setup is complete
        this.initializeVisualizer();

        this.updateCalculations();

        console.log('Aquarium Tank Simulator initialized');
    }

    initializeVisualizer() {
        try {
            const canvasContainer = document.getElementById('tank-canvas');
            console.log('Canvas container found:', !!canvasContainer);
            if (canvasContainer) {
                // Ensure container has proper dimensions
                const container = canvasContainer.parentElement; // canvas-container
                if (container) {
                    container.style.width = '100%';
                    container.style.height = '400px';
                    canvasContainer.style.width = '100%';
                    canvasContainer.style.height = '100%';
                    console.log('Container dimensions set:', container.offsetWidth, 'x', container.offsetHeight);
                }

                console.log('Creating TankVisualizer...');
                this.visualizer = new TankVisualizer(canvasContainer);
                console.log('Visualizer created:', !!this.visualizer);

                // If visualizer failed to initialize, try again after a delay
                if (!this.visualizer || !this.visualizer.scene) {
                    console.warn('Visualizer initialization may have failed, retrying...');
                    setTimeout(() => {
                        if (!this.visualizer || !this.visualizer.scene) {
                            console.error('Visualizer retry also failed');
                        }
                    }, 500);
                }
            } else {
                console.error('Canvas container not found');
            }
        } catch (error) {
            console.error('Failed to initialize visualizer:', error);
        }
    }

    setupDimensionControls() {
        const dimensions = Object.values(DIMENSIONS);

        dimensions.forEach(dim => {
            const input = DOMHelper.getElement(dim);
            const display = DOMHelper.getElement(`${dim}Value`);

            if (!input || !display) {
                console.error(`Missing DOM elements for ${dim}`);
                return;
            }

            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                DOMHelper.setText(`${dim}Value`, value);
                this.clearInputError(dim);
                this.updatingFromVolume = false;
                this.debouncedUpdate();
            });

            input.addEventListener('change', (e) => {
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

    setupVolumeInputs() {
        const volumeInput = document.getElementById('volumeInput');
        const waterVolumeInput = document.getElementById('waterVolumeInput');

        if (!volumeInput || !waterVolumeInput) {
            console.error('Volume input elements not found');
            return;
        }

        volumeInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                document.getElementById('volumeValue').textContent = value.toFixed(1);
                this.updatingFromVolume = true;
                this.adjustDimensionsForVolume('total', value, this.volumeUnitSystem);
            }
        });

        waterVolumeInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                document.getElementById('waterVolumeValue').textContent = value.toFixed(1);
                this.updatingFromVolume = true;
                this.adjustDimensionsForVolume('water', value, this.volumeUnitSystem);
            }
        });
    }

    adjustDimensionsForVolume(type, volume) {
        if (isNaN(volume) || volume <= 0) {
            return;
        }

        let volumeLiters = this.volumeUnitSystem === VOLUME_UNITS.GALLONS ?
            volume / CONVERSIONS.GALLONS_TO_LITERS : volume;

        if (type === 'water') {
            volumeLiters = volumeLiters / (1 - CONVERSIONS.DISPLACEMENT_PERCENT);
        }

        const volumeCm3 = volumeLiters * 1000;

        let width = parseFloat(DOMHelper.getValue('width'));
        let length = parseFloat(DOMHelper.getValue('length'));
        let height = parseFloat(DOMHelper.getValue('height'));

        if (this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL) {
            width *= CONVERSIONS.INCHES_TO_CM;
            length *= CONVERSIONS.INCHES_TO_CM;
            height *= CONVERSIONS.INCHES_TO_CM;
        }

        const currentVolume = width * length * height;

        if (currentVolume === 0) {
            console.warn('Current volume is zero, cannot adjust');
            return;
        }

        const ratio = Math.cbrt(volumeCm3 / currentVolume);

        const newWidth = this.clampDimension(width * ratio);
        const newLength = this.clampDimension(length * ratio);
        const newHeight = this.clampDimension(height * ratio);

        if (this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL) {
            const widthIn = Math.round(newWidth / CONVERSIONS.INCHES_TO_CM);
            const lengthIn = Math.round(newLength / CONVERSIONS.INCHES_TO_CM);
            const heightIn = Math.round(newHeight / CONVERSIONS.INCHES_TO_CM);
            DOMHelper.updateDimensionDisplay('width', widthIn);
            DOMHelper.updateDimensionDisplay('length', lengthIn);
            DOMHelper.updateDimensionDisplay('height', heightIn);
        } else {
            const widthCm = Math.round(newWidth);
            const lengthCm = Math.round(newLength);
            const heightCm = Math.round(newHeight);
            DOMHelper.updateDimensionDisplay('width', widthCm);
            DOMHelper.updateDimensionDisplay('length', lengthCm);
            DOMHelper.updateDimensionDisplay('height', heightCm);
        }

        this.updatingFromVolume = false;
        this.updateCalculations();
        const unitSymbol = this.volumeUnitSystem === VOLUME_UNITS.GALLONS ? 'gal' : 'L';
        console.log(`Adjusted dimensions for ${type} volume: ${volume}${unitSymbol}`);
    }

    clampDimension(cm) {
        const minCm = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 25.4 : 25;
        const maxCm = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 304.8 : 305;
        return Math.max(minCm, Math.min(maxCm, cm));
    }

    setupUnitSystem() {
        const unitSelector = document.getElementById('unitSystem');

        unitSelector.addEventListener('change', (e) => {
            this.switchUnitSystem(e.target.value);
        });

        this.updateUnitDisplays();
        this.updatePresetLabels();
    }

    setupVolumeUnitSystem() {
        const volumeUnitSelector = document.getElementById('volumeUnit');

        if (volumeUnitSelector) {
            volumeUnitSelector.addEventListener('change', (e) => {
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
    }

    setupTankPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');

        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.showLoadingState();

                const button = e.target.closest('.preset-btn');
                const width = parseInt(button.dataset.width);
                const length = parseInt(button.dataset.length);
                const height = parseInt(button.dataset.height);

                if (isNaN(width) || isNaN(length) || isNaN(height)) {
                    console.error('Invalid preset dimensions');
                    this.hideLoadingState();
                    return;
                }

                // Update all dimension displays (both sliders and value displays)
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
                    console.error('Could not find dimension input elements');
                }
                Object.values(DIMENSIONS).forEach(dim => this.clearInputError(dim));

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

        console.log(`Switched from ${oldSystem} to ${newSystem} units`);
    }

    convertDimensionValues(fromSystem, toSystem) {
        const dimensions = Object.values(DIMENSIONS);

        dimensions.forEach(dim => {
            let currentValue = parseFloat(DOMHelper.getValue(dim));

            if (isNaN(currentValue)) return;

            if (fromSystem === UNIT_SYSTEMS.IMPERIAL && toSystem === UNIT_SYSTEMS.METRIC) {
                currentValue = currentValue * CONVERSIONS.INCHES_TO_CM;
            } else if (fromSystem === UNIT_SYSTEMS.METRIC && toSystem === UNIT_SYSTEMS.IMPERIAL) {
                currentValue = currentValue / CONVERSIONS.INCHES_TO_CM;
            }

            currentValue = Math.round(currentValue);
            DOMHelper.updateDimensionDisplay(dim, currentValue);
        });
    }

    updateUnitDisplays() {
        const unitDisplays = ['widthUnit', 'lengthUnit', 'heightUnit'];
        const unit = this.currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? 'in' : 'cm';

        unitDisplays.forEach(displayId => {
            DOMHelper.setText(displayId, unit);
        });
    }

    updateDimensionRanges() {
        const dimensions = Object.values(DIMENSIONS);
        const ranges = {
            [UNIT_SYSTEMS.IMPERIAL]: { min: 10, max: 120, step: 1 },
            [UNIT_SYSTEMS.METRIC]: { min: 25, max: 305, step: 5 }
        };

        const range = ranges[this.currentUnitSystem];

        dimensions.forEach(dim => {
            const input = DOMHelper.getElement(dim);
            input.min = range.min;
            input.max = range.max;
            input.step = range.step;

            let currentValue = parseFloat(input.value);
            currentValue = Math.max(range.min, Math.min(range.max, currentValue));
            DOMHelper.updateDimensionDisplay(dim, currentValue);
        });
    }

    updateCalculations(forceUpdateVolume = false) {
        const width = parseFloat(DOMHelper.getValue('width'));
        const length = parseFloat(DOMHelper.getValue('length'));
        const height = parseFloat(DOMHelper.getValue('height'));

        if (isNaN(width) || isNaN(length) || isNaN(height)) {
            console.error('Invalid dimension values detected');
            return;
        }

        // Convert to inches if in metric system
        let widthIn = width;
        let lengthIn = length;
        let heightIn = height;

        if (this.currentUnitSystem === UNIT_SYSTEMS.METRIC) {
            widthIn = width / CONVERSIONS.INCHES_TO_CM;
            lengthIn = length / CONVERSIONS.INCHES_TO_CM;
            heightIn = height / CONVERSIONS.INCHES_TO_CM;
        }

        const volumeLiters = this.calculator.calculateVolume(lengthIn, widthIn, heightIn);
        const volumeGallons = this.calculator.convertToGallons(volumeLiters);
        const waterLiters = this.calculator.adjustForDisplacement(volumeLiters);
        const surfaceArea = this.calculator.calculateSurfaceArea(lengthIn, widthIn, heightIn);

        const glassRecommendation = this.recommender.getRecommendation(lengthIn, widthIn, heightIn);
        const detailedRecommendation = this.recommender.getDetailedRecommendation(lengthIn, widthIn, heightIn);

        this.updateVolumeDisplays(volumeLiters, volumeGallons, waterLiters, forceUpdateVolume);
        this.updateSurfaceAreaDisplay(surfaceArea);
        DOMHelper.setText('glassResult', glassRecommendation);
        DOMHelper.setText('glassNotes', detailedRecommendation?.safetyNote || 'Standard aquarium glass recommended');

        this.updateEquipmentRecommendations(lengthIn, widthIn, heightIn, volumeGallons, surfaceArea);

        try {
            if (this.visualizer && this.visualizer.updateDimensions) {
                console.log('Updating visualizer with dimensions:', widthIn / 12, heightIn / 12, lengthIn / 12);
                this.visualizer.updateDimensions(widthIn / 12, heightIn / 12, lengthIn / 12);
            } else {
                console.warn('Visualizer not available:', this.visualizer);
            }
        } catch (error) {
            console.error('Failed to update visualizer:', error);
        }
    }

    updateVolumeDisplays(liters, gallons, waterLiters, forceUpdate = false) {
        const waterGallons = this.calculator.convertToGallons(waterLiters);

        if (forceUpdate || !this.updatingFromVolume) {
            if (this.volumeUnitSystem === VOLUME_UNITS.GALLONS) {
                DOMHelper.updateVolumeDisplay('volumeInput', 'volumeValue', gallons, 1);
                DOMHelper.updateVolumeDisplay('waterVolumeInput', 'waterVolumeValue', waterGallons, 1);
                DOMHelper.getElement('volumeInput').max = 500;
                DOMHelper.getElement('waterVolumeInput').max = 500;
            } else {
                DOMHelper.updateVolumeDisplay('volumeInput', 'volumeValue', liters, 1);
                DOMHelper.updateVolumeDisplay('waterVolumeInput', 'waterVolumeValue', waterLiters, 1);
                DOMHelper.getElement('volumeInput').max = 2000;
                DOMHelper.getElement('waterVolumeInput').max = 2000;
            }
        }
    }

    updateEquipmentRecommendations(length, width, height, volumeGallons, surfaceArea) {
        const recommendations = this.equipmentRecommender.getAllRecommendations(length, width, height, volumeGallons, surfaceArea);

        if (!recommendations) {
            console.error('Failed to get equipment recommendations');
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
            atoRecommendation: recommendations.ato || '--'
        };

        DOMHelper.batchUpdate(updates);
    }

    updateSurfaceAreaDisplay(surfaceArea) {
        const surfaceAreaEl = document.getElementById('surfaceAreaResult');
        const indicator = document.getElementById('surfaceAreaIndicator');
        const indicatorText = document.getElementById('surfaceAreaText');

        if (!surfaceAreaEl || !indicator || !indicatorText) return;

        const topSqFt = surfaceArea.topSqFt.toFixed(1);
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

    debouncedUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            this.updateCalculations();
        }, 300);
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
        const resultsSections = document.querySelectorAll('.results-section, .equipment-section');
        resultsSections.forEach(section => section.classList.add('loading'));
    }

    hideLoadingState() {
        const resultsSections = document.querySelectorAll('.results-section, .equipment-section');
        resultsSections.forEach(section => section.classList.remove('loading'));
    }

    setupCalculationModeToggle() {
        const fixedVolumeCheckbox = document.getElementById('fixedVolumeMode');

        if (fixedVolumeCheckbox) {
            fixedVolumeCheckbox.addEventListener('change', (e) => {
                this.fixedVolumeMode = e.target.checked;
                this.updateControlStates();
            });
        }

        this.updateControlStates();
    }

    updateControlStates() {
        const dimensionSliders = ['width', 'length', 'height'].map(id => document.getElementById(id));
        const volumeSliders = ['volumeInput', 'waterVolumeInput'].map(id => document.getElementById(id));
        const resultsSection = document.querySelector('.results-section');

        if (!this.fixedVolumeMode) {
            dimensionSliders.forEach(slider => {
                if (slider) {
                    slider.disabled = false;
                    slider.style.opacity = '1';
                    slider.style.pointerEvents = 'auto';
                }
            });

            volumeSliders.forEach(slider => {
                if (slider) {
                    slider.disabled = true;
                    slider.style.opacity = '0.5';
                    slider.style.pointerEvents = 'none';
                }
            });

            if (resultsSection) {
                resultsSection.classList.remove('volume-mode');
            }
        } else {
            dimensionSliders.forEach(slider => {
                if (slider) {
                    slider.disabled = true;
                    slider.style.opacity = '0.5';
                    slider.style.pointerEvents = 'none';
                }
            });

            volumeSliders.forEach(slider => {
                if (slider) {
                    slider.disabled = false;
                    slider.style.opacity = '1';
                    slider.style.pointerEvents = 'auto';
                }
            });

            if (resultsSection) {
                resultsSection.classList.add('volume-mode');
            }
        }

        const dimensionControls = document.querySelectorAll('.dimension-controls input');
        const volumeControls = document.querySelectorAll('.volume-control input');

        if (!this.fixedVolumeMode) {
            dimensionControls.forEach(control => {
                control.disabled = false;
                control.style.opacity = '1';
            });

            volumeControls.forEach(control => {
                control.disabled = true;
                control.style.opacity = '0.5';
            });
        } else {
            dimensionControls.forEach(control => {
                control.disabled = true;
                control.style.opacity = '0.5';
            });

            volumeControls.forEach(control => {
                control.disabled = false;
                control.style.opacity = '1';
            });
        }
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
