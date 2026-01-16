// Glass panel dimensions and weight calculator
import { CONVERSIONS } from '../../config/constants.js';
import { formatNumber, formatWeight } from '../../utils/formatters.js';

const LBS_TO_KG = 0.453592;

export class GlassPanelCalculator {
  constructor(glassRecommender) {
    this.glassRecommender = glassRecommender;
    this.glassDensity = 0.0919; // lbs per cubic inch (approx 2.5 g/cm³)
  }

  calculatePanels(lengthIn, widthIn, heightIn) {
    const thicknessIn = this.getThicknessInInches(lengthIn, widthIn, heightIn);

    const panels = {
      front: this.calculatePanel(widthIn, heightIn, thicknessIn, 'Front'),
      back: this.calculatePanel(widthIn, heightIn, thicknessIn, 'Back'),
      left: this.calculatePanel(lengthIn, heightIn, thicknessIn, 'Left Side'),
      right: this.calculatePanel(lengthIn, heightIn, thicknessIn, 'Right Side'),
      bottom: this.calculatePanel(lengthIn, widthIn, thicknessIn, 'Bottom'),
      top: this.calculatePanel(widthIn, lengthIn, thicknessIn, 'Top (Optional)'),
    };

    return panels;
  }

  calculatePanel(dim1In, dim2In, thicknessIn, name) {
    const areaSqIn = dim1In * dim2In;
    const volumeCubicIn = areaSqIn * thicknessIn;
    const weightLbs = volumeCubicIn * this.glassDensity;

    return {
      name,
      width: Math.round(dim1In),
      height: Math.round(dim2In),
      widthCm: Math.round(dim1In * CONVERSIONS.INCHES_TO_CM),
      heightCm: Math.round(dim2In * CONVERSIONS.INCHES_TO_CM),
      thickness: thicknessIn,
      thicknessMm: Math.round(thicknessIn * 25.4),
      areaSqIn: formatNumber(areaSqIn, 1),
      areaSqFt: formatNumber(areaSqIn / 144, 2),
      weightLbs: formatNumber(weightLbs, 1),
      weightKg: this.convertLbsToKg(weightLbs),
    };
  }

  convertLbsToKg(lbs) {
    return formatNumber(lbs * LBS_TO_KG, 1);
  }

  getThicknessInInches(length, width, height) {
    const thickness = this.glassRecommender.getThicknessForDimensions(
      height,
      Math.max(length, width)
    );
    return thickness / 25.4; // Convert mm to inches
  }

  getTotalGlassWeight(panels) {
    let totalLbs = 0;
    Object.values(panels).forEach(panel => {
      totalLbs += parseFloat(panel.weightLbs);
    });
    return {
      lbs: formatNumber(totalLbs, 1),
      kg: this.convertLbsToKg(totalLbs),
    };
  }
}

// Load weight distribution configurations from JSON file
import { loadJSONDataSync } from './utils/json-loader.js';

const defaultWeightDistributionConfigs = {
  support_configurations: {
    4: {
      name: '4 Corners',
      description: 'Standard cabinet or metal stand with 4 corner supports',
      points: 4,
    },
    6: {
      name: '6 Points',
      description: '4 corners + 2 center supports front/back',
      points: 6,
    },
    8: {
      name: '8 Points',
      description: '4 corners + 2 center front/back + 2 center left/right',
      points: 8,
    },
  },
};

let weightDistributionConfigs = defaultWeightDistributionConfigs;

// Load weight distribution configs from JSON file
loadJSONDataSync(
  '/data/weight-distribution-configs.json',
  defaultWeightDistributionConfigs,
  'weight distribution configs',
  data => {
    weightDistributionConfigs = data;
  }
);

export class WeightDistributionCalculator {
  constructor(glassDensity = 0.0919) {
    this.glassDensity = glassDensity;
  }

  calculateTotalWeight(waterGallons, isSaltwater, glassWeightLbs) {
    const waterDensity = isSaltwater ? 8.55 : 8.34;
    const waterWeightLbs = waterGallons * waterDensity;

    const totalWeightLbs = waterWeightLbs + glassWeightLbs;

    return {
      waterLbs: formatNumber(waterWeightLbs, 1),
      waterKg: this.convertLbsToKg(waterWeightLbs),
      glassLbs: formatNumber(glassWeightLbs, 1),
      glassKg: this.convertLbsToKg(glassWeightLbs),
      totalLbs: formatNumber(totalWeightLbs, 1),
      totalKg: this.convertLbsToKg(totalWeightLbs),
    };
  }

  convertLbsToKg(lbs) {
    return formatNumber(lbs * LBS_TO_KG, 1);
  }

  calculateDistribution(totalWeightLbs, supportPoints) {
    const config =
      weightDistributionConfigs.support_configurations[supportPoints] ||
      weightDistributionConfigs.support_configurations['4'];

    const weightPerPoint = totalWeightLbs / config.points;

    return {
      name: config.name,
      description: config.description,
      points: config.points,
      weightPerPoint: weightPerPoint,
    };
  }

  getSupportRecommendations(totalWeightLbs, lengthIn, widthIn) {
    const recommendations = [];
    const weightThresholds = [200, 500];

    if (totalWeightLbs < weightThresholds[0]) {
      recommendations.push({
        type: 'info',
        message: 'A basic cabinet or metal stand with 4 corner supports is adequate',
      });
    } else if (totalWeightLbs < weightThresholds[1]) {
      recommendations.push({
        type: 'info',
        message:
          'Use a sturdy stand rated for at least ' + Math.ceil(totalWeightLbs * 1.5) + ' lbs',
      });
      if (lengthIn > 48 || widthIn > 24) {
        recommendations.push({
          type: 'warning',
          message: 'Consider center support for longer spans',
        });
      }
    } else {
      recommendations.push({
        type: 'info',
        message:
          'Use a heavy-duty stand rated for at least ' + Math.ceil(totalWeightLbs * 1.5) + ' lbs',
      });
      if (lengthIn > 48) {
        recommendations.push({
          type: 'warning',
          message: 'Add center supports along the length',
        });
      }
      if (widthIn > 30) {
        recommendations.push({
          type: 'warning',
          message: 'Add center supports along the width',
        });
      }
      recommendations.push({
        type: 'warning',
        message:
          'Ensure floor can support the total weight (approximately ' +
          Math.ceil(totalWeightLbs * 0.45) +
          ' kg)',
      });
    }

    return recommendations;
  }
}
