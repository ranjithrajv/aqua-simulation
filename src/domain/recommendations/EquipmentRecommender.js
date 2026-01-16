import { EquipmentStrategyFactory } from '../strategies/EquipmentStrategy.js';
import { logger } from '../../utils/logger.js';

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
      ato: EquipmentStrategyFactory.createATOStrategy(),
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
      logger.warn(`Unknown equipment type: ${equipmentType}`);
      return '--';
    }
    return strategy.getRecommendation(...params);
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
    const filterFlow = this.estimateFilterFlow(volumeGallons);

    return {
      filter: this.getRecommendation('filter', volumeGallons, surfaceArea),
      heater: this.getRecommendation('heater', volumeGallons),
      chiller: this.getRecommendation('chiller', volumeGallons),
      uvSterilizer: this.getRecommendation('uvSterilizer', 0, null, filterFlow),
      airPump: this.getRecommendation('airPump', 0, surfaceArea),
      thermometer: this.getRecommendation('thermometer', volumeGallons),
      circulationPump: this.getRecommendation(
        'circulationPump',
        volumeGallons,
        null,
        length,
        width
      ),
      ato: this.getRecommendation('ato', 0, surfaceArea),
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
