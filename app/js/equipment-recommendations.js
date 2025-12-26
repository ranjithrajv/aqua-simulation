// Equipment recommendations using strategy pattern
import { EquipmentStrategyFactory } from './equipment-strategy.js';

export class EquipmentRecommender {
    constructor() {
        // Initialize all equipment strategies
        this.strategies = {
            filter: EquipmentStrategyFactory.createFilterStrategy(),
            heater: EquipmentStrategyFactory.createHeaterStrategy(),
            chiller: EquipmentStrategyFactory.createChillerStrategy(),
            uvSterilizer: EquipmentStrategyFactory.createUVSterilizerStrategy(),
            airPump: EquipmentStrategyFactory.createAirPumpStrategy(),
            thermometer: EquipmentStrategyFactory.createThermometerStrategy(),
            circulationPump: EquipmentStrategyFactory.createCirculationPumpStrategy(),
            ato: EquipmentStrategyFactory.createATOStrategy()
        };
    }

    /**
     * Get equipment recommendation using strategy pattern
     * @param {string} equipmentType - Type of equipment
     * @param {...any} params - Parameters for recommendation
     * @returns {string} Equipment recommendation
     */
    getRecommendation(equipmentType, ...params) {
        const strategy = this.strategies[equipmentType];
        if (!strategy) {
            console.warn(`Unknown equipment type: ${equipmentType}`);
            return '--';
        }
        return strategy.getRecommendation(...params);
    }

    // Convenience methods for backward compatibility
    getFilterRecommendation(volumeGallons, surfaceArea) {
        return this.getRecommendation('filter', volumeGallons, surfaceArea);
    }

    getHeaterRecommendation(volumeGallons) {
        return this.getRecommendation('heater', volumeGallons);
    }

    getChillerRecommendation(volumeGallons) {
        return this.getRecommendation('chiller', volumeGallons);
    }

    getUVSterilizerRecommendation(filterFlow) {
        return this.getRecommendation('uvSterilizer', 0, null, filterFlow || 300);
    }

    getAirPumpRecommendation(surfaceArea) {
        return this.getRecommendation('airPump', 0, surfaceArea);
    }

    getThermometerRecommendation(volumeGallons) {
        return this.getRecommendation('thermometer', volumeGallons);
    }

    getCirculationPumpRecommendation(volumeGallons, length, width) {
        return this.getRecommendation('circulationPump', volumeGallons, null, length, width);
    }

    getATORcommendation(surfaceArea) {
        return this.getRecommendation('ato', 0, surfaceArea);
    }

    getHeaterRecommendation(volumeGallons) {
        return this.getRecommendation('heater', volumeGallons);
    }

    getChillerRecommendation(volumeGallons) {
        return this.getRecommendation('chiller', volumeGallons);
    }

    getUVSterilizerRecommendation(filterFlow) {
        return this.getRecommendation('uvSterilizer', 0, null, filterFlow || 300);
    }

    getAirPumpRecommendation(surfaceArea) {
        return this.getRecommendation('airPump', 0, surfaceArea);
    }

    getThermometerRecommendation(volumeGallons) {
        return this.getRecommendation('thermometer', volumeGallons);
    }

    getCirculationPumpRecommendation(volumeGallons, length, width) {
        return this.getRecommendation('circulationPump', volumeGallons, null, length, width);
    }

    getATORcommendation(surfaceArea) {
        return this.getRecommendation('ato', 0, surfaceArea);
    }

    // Convenience methods for backward compatibility - all use strategy pattern
    getFilterRecommendation(volumeGallons, surfaceArea) {
        return this.getRecommendation('filter', volumeGallons, surfaceArea);
    }

    getHeaterRecommendation(volumeGallons) {
        return this.getRecommendation('heater', volumeGallons);
    }

    getChillerRecommendation(volumeGallons) {
        return this.getRecommendation('chiller', volumeGallons);
    }

    getUVSterilizerRecommendation(filterFlow) {
        return this.getRecommendation('uvSterilizer', 0, null, filterFlow || 300);
    }

    getAirPumpRecommendation(surfaceArea) {
        return this.getRecommendation('airPump', 0, surfaceArea);
    }

    getThermometerRecommendation(volumeGallons) {
        return this.getRecommendation('thermometer', volumeGallons);
    }

    getCirculationPumpRecommendation(volumeGallons, length, width) {
        return this.getRecommendation('circulationPump', volumeGallons, null, length, width);
    }

    getATORcommendation(surfaceArea) {
        return this.getRecommendation('ato', 0, surfaceArea);
    }

    /**
     * Get all equipment recommendations for a tank
     * @param {number} length - Tank length in inches
     * @param {number} width - Tank width in inches
     * @param {number} height - Tank height in inches
     * @param {number} volumeGallons - Tank volume in gallons
     * @param {object} surfaceArea - Surface area object
     * @returns {object} All equipment recommendations
     */
    getAllRecommendations(length, width, height, volumeGallons, surfaceArea) {
        // Estimate filter flow rate for UV sterilizer recommendation
        const filterFlow = this.estimateFilterFlow(volumeGallons);

        return {
            filter: this.getFilterRecommendation(volumeGallons, surfaceArea),
            heater: this.getHeaterRecommendation(volumeGallons),
            chiller: this.getChillerRecommendation(volumeGallons),
            uvSterilizer: this.getUVSterilizerRecommendation(filterFlow),
            airPump: this.getAirPumpRecommendation(surfaceArea),
            thermometer: this.getThermometerRecommendation(volumeGallons),
            circulationPump: this.getCirculationPumpRecommendation(volumeGallons, length, width),
            ato: this.getATORcommendation(surfaceArea)
        };
    }

    /**
     * Estimate filter flow rate based on tank volume
     * @param {number} volumeGallons - Tank volume in gallons
     * @returns {number} Estimated flow rate in GPH
     */
    estimateFilterFlow(volumeGallons) {
        // Typical filter turnover: 3-5x tank volume per hour
        const minFlow = volumeGallons * 3;
        const maxFlow = volumeGallons * 5;
        return (minFlow + maxFlow) / 2; // Use average for estimation
    }
}