import { loadJSONDataSync } from '../../utils/json-loader.js';

const defaultRecommendationsData = {
  volume: {
    thresholds: [30, 80, 150],
    roomType: [
      'Perfect for bedrooms, offices, or small living areas. Desktop tanks fit well on sturdy desks.',
      'Ideal for living rooms, family rooms, or dedicated hobby rooms. Consider a focal point.',
      'Best for spacious living rooms or dedicated fish rooms. Consider a dedicated space.',
      'Requires a dedicated room or large open space. Consider professional consultation.',
    ],
    location: [
      'Place on a dedicated aquarium stand or sturdy desk. Avoid high-traffic areas.',
      'Choose a visible location away from direct sunlight. Ensure proper floor support.',
      'Place against a load-bearing wall. Ensure floor can support weight.',
      'Locate on ground floor with reinforced flooring. Plan for equipment access.',
    ],
    lighting: [
      'Low light requirements. Consider LED lighting with adjustable brightness.',
      'Medium light needs. LED or fluorescent fixtures with adequate coverage.',
      'High light output required. Multiple LED fixtures or T5HO recommended.',
      'Very high light needs. Professional-grade LED system with custom spectrum.',
    ],
    outlets: [2, 3, 4, 6],
  },
  dimension: {
    thresholds: [36, 60],
    access: [
      'Easy access from front and sides. 1-2 feet clearance recommended.',
      'Front and side access needed. 2-3 feet clearance for maintenance.',
      'Multiple access points required. 3+ feet clearance on all sides for equipment.',
    ],
  },
  weight: {
    thresholds: [200, 500],
    spacing: [
      'Place 6 inches from walls for airflow and maintenance access.',
      'Maintain 12 inches from walls. Ensure proper ventilation around equipment.',
      '18-24 inches spacing from walls recommended for large equipment access and airflow.',
    ],
  },
};

let recommendationsData = defaultRecommendationsData;

// Load placement recommendations from JSON file
loadJSONDataSync(
  '/data/placement-guidelines.json',
  defaultRecommendationsData,
  'placement recommendations',
  data => {
    recommendationsData = data;
  }
);

const RECOMMENDATIONS_DATA = recommendationsData;

export class PlacementGuide {
  constructor() {}

  getRecommendations(dimensions, volume, weightLbs) {
    const maxDimension = Math.max(dimensions.width, dimensions.length, dimensions.height);

    return {
      roomType: this.getTieredRecommendation(
        volume,
        RECOMMENDATIONS_DATA.volume.thresholds,
        RECOMMENDATIONS_DATA.volume.roomType
      ),
      location: this.getTieredRecommendation(
        volume,
        RECOMMENDATIONS_DATA.volume.thresholds,
        RECOMMENDATIONS_DATA.volume.location
      ),
      power: this.getPowerRecommendation(volume),
      lighting: this.getTieredRecommendation(
        volume,
        RECOMMENDATIONS_DATA.volume.thresholds,
        RECOMMENDATIONS_DATA.volume.lighting
      ),
      access: this.getTieredRecommendation(
        maxDimension,
        RECOMMENDATIONS_DATA.dimension.thresholds,
        RECOMMENDATIONS_DATA.dimension.access
      ),
      spacing: this.getTieredRecommendation(
        weightLbs,
        RECOMMENDATIONS_DATA.weight.thresholds,
        RECOMMENDATIONS_DATA.weight.spacing
      ),
    };
  }

  getTips(maxDimension, volume, weightLbs, length) {
    const tips = [];

    if (volume >= 150) {
      tips.push('Consider consulting a structural engineer for tanks over 150 gallons');
      tips.push('Install a drip tray or flooring protection underneath tank');
    }
    if (weightLbs > 500) {
      tips.push('Ensure floor joists can support concentrated weight');
      tips.push('Consider using a load-bearing wall for placement');
    }
    if (length > 48) {
      tips.push('Use a stand with center support for tanks over 4 feet long');
    }
    tips.push(
      'Keep away from direct sunlight to prevent algae growth and temperature fluctuations'
    );
    tips.push('Avoid placing near air vents, radiators, or windows');
    tips.push('Ensure location allows easy water changes and maintenance');
    tips.push('Consider viewing angle - place where you spend most of your time');

    return tips;
  }

  getTieredRecommendation(value, thresholds, recommendations) {
    let index = thresholds.findIndex(threshold => value < threshold);
    if (index === -1) index = recommendations.length - 1;
    return recommendations[index];
  }

  getPowerRecommendation(volume) {
    const outletsNeeded = this.getTieredRecommendation(
      volume,
      RECOMMENDATIONS_DATA.volume.thresholds,
      RECOMMENDATIONS_DATA.volume.outlets
    );
    return `Requires ${outletsNeeded} grounded electrical outlets within 6ft. Use a GFCI protected circuit for safety. Consider a power strip with surge protection.`;
  }
}
