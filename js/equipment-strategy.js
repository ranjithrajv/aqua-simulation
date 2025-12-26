// Generic equipment recommendation strategy
export class EquipmentStrategy {
    /**
     * @param {string} type - Type of criteria ('volume', 'surfaceArea', 'flow', 'dimensions')
     * @param {Array} recommendations - Array of recommendation objects
     * @param {Function} criteriaExtractor - Function to extract criteria value from parameters
     */
    constructor(type, recommendations, criteriaExtractor = null) {
        this.type = type;
        this.recommendations = recommendations;
        this.criteriaExtractor = criteriaExtractor || this.getDefaultExtractor(type);
    }

    /**
     * Get default criteria extractor based on type
     * @param {string} type - Criteria type
     * @returns {Function} Extractor function
     */
    getDefaultExtractor(type) {
        switch (type) {
            case 'volume':
                return (params) => params[0]; // volumeGallons
            case 'surfaceArea':
                return (params) => params[1]?.topSqFt || 0; // surfaceArea
            case 'flow':
                return (params) => params[2] || 300; // estimated flow
            case 'dimensions':
                return (params) => [params[0], params[3], params[4]]; // [volumeGallons, length, width]
            default:
                return () => 0;
        }
    }

    /**
     * Get recommendation based on criteria
     * @param {...any} params - Parameters for criteria extraction
     * @returns {string} Recommendation text
     */
    getRecommendation(...params) {
        const criteriaValue = this.criteriaExtractor(params);

        if (this.type === 'dimensions') {
            // Special handling for dimensions-based recommendations
            return this.getDimensionsRecommendation(criteriaValue);
        }

        // Find matching recommendation
        const recommendation = this.recommendations.find(rec => {
            const property = this.getCriteriaProperty(rec);
            return criteriaValue <= rec[property];
        });

        return recommendation ?
            recommendation.recommendation :
            this.recommendations[this.recommendations.length - 1]?.recommendation || '--';
    }

    /**
     * Get criteria property name from recommendation object
     * @param {Object} rec - Recommendation object
     * @returns {string} Property name
     */
    getCriteriaProperty(rec) {
        if ('maxVolume' in rec) return 'maxVolume';
        if ('maxArea' in rec) return 'maxArea';
        if ('maxFlow' in rec) return 'maxFlow';
        return 'maxVolume'; // fallback
    }

    /**
     * Special handling for dimensions-based recommendations
     * @param {Array} dimensionsData - [volumeGallons, length, width]
     * @returns {string} Recommendation with positioning advice
     */
    getDimensionsRecommendation([volumeGallons, length, width]) {
        const recommendation = this.recommendations.find(rec =>
            volumeGallons <= rec.maxVolume
        );

        let baseRec = recommendation ?
            recommendation.recommendation :
            this.recommendations[this.recommendations.length - 1]?.recommendation || '--';

        // Add positioning advice for long/narrow tanks
        if (length > width * 1.5) {
            baseRec += ' - consider multiple units for even flow in long tanks';
        }

        return baseRec;
    }
}

// Factory for creating equipment strategies
export class EquipmentStrategyFactory {
    /**
     * Create filter strategy
     * @returns {EquipmentStrategy} Filter recommendation strategy
     */
    static createFilterStrategy() {
        const recommendations = [
            { maxVolume: 20, recommendation: '10-20 GPH canister or small HOB filter' },
            { maxVolume: 40, recommendation: '20-40 GPH canister or medium HOB filter' },
            { maxVolume: 75, recommendation: '40-75 GPH canister filter' },
            { maxVolume: 125, recommendation: '75-125 GPH canister filter' },
            { maxVolume: 200, recommendation: '125-200 GPH canister filter' },
            { maxVolume: Infinity, recommendation: '200+ GPH canister filter or sump system' }
        ];

        return new EquipmentStrategy('volume', recommendations, (params) => {
            const [volumeGallons, surfaceArea] = params;
            let rec = recommendations.find(r => volumeGallons <= r.maxVolume)?.recommendation ||
                     recommendations[recommendations.length - 1].recommendation;

            const topAreaFt = surfaceArea?.topSqFt || 0;

            if (topAreaFt < 1.5 && volumeGallons < 20) {
                rec = '5-10 GPH sponge filter ideal for shallow tanks with small surface area';
            } else if (topAreaFt > 6) {
                rec += ' + surface skimmer for large surface area';
            } else if (topAreaFt < 3 && volumeGallons > 30) {
                rec += ' - consider adding powerhead for better circulation in tall/deep tanks';
            }

            return rec;
        });
    }

    /**
     * Create heater strategy
     * @returns {EquipmentStrategy} Heater recommendation strategy
     */
    static createHeaterStrategy() {
        const recommendations = [
            { maxVolume: 10, recommendation: '50-100W submersible heater' },
            { maxVolume: 20, recommendation: '100-150W submersible heater' },
            { maxVolume: 40, recommendation: '150-200W submersible heater' },
            { maxVolume: 75, recommendation: '200-300W submersible heater' },
            { maxVolume: 125, recommendation: '300-400W submersible heater' },
            { maxVolume: 200, recommendation: '400-600W submersible heater' },
            { maxVolume: Infinity, recommendation: '600W+ submersible or inline heater' }
        ];

        return new EquipmentStrategy('volume', recommendations);
    }

    /**
     * Create chiller strategy
     * @returns {EquipmentStrategy} Chiller recommendation strategy
     */
    static createChillerStrategy() {
        const recommendations = [
            { maxVolume: 20, recommendation: '1/10 HP chiller for small tanks in warm climates' },
            { maxVolume: 75, recommendation: '1/4 HP chiller for medium tanks' },
            { maxVolume: 125, recommendation: '1/3 HP chiller for large tanks' },
            { maxVolume: Infinity, recommendation: '1/2 to 1 HP chiller for very large tanks' }
        ];

        return new EquipmentStrategy('volume', recommendations);
    }

    /**
     * Create UV sterilizer strategy
     * @returns {EquipmentStrategy} UV sterilizer recommendation strategy
     */
    static createUVSterilizerStrategy() {
        const recommendations = [
            { maxFlow: 100, recommendation: '5-9W UV sterilizer' },
            { maxFlow: 200, recommendation: '11-18W UV sterilizer' },
            { maxFlow: 400, recommendation: '25-36W UV sterilizer' },
            { maxFlow: Infinity, recommendation: '55W+ UV sterilizer or multiple units' }
        ];

        return new EquipmentStrategy('flow', recommendations);
    }

    /**
     * Create air pump strategy
     * @returns {EquipmentStrategy} Air pump recommendation strategy
     */
    static createAirPumpStrategy() {
        const recommendations = [
            { maxArea: 2, recommendation: '10-30 GPH air pump with single airstone' },
            { maxArea: 4, recommendation: '30-60 GPH air pump with dual airstones' },
            { maxArea: Infinity, recommendation: '60-100 GPH air pump with manifold system' }
        ];

        return new EquipmentStrategy('surfaceArea', recommendations);
    }

    /**
     * Create thermometer strategy
     * @returns {EquipmentStrategy} Thermometer recommendation strategy
     */
    static createThermometerStrategy() {
        const recommendations = [
            { maxVolume: 20, recommendation: 'Digital stick thermometer' },
            { maxVolume: 75, recommendation: 'Digital thermometer with external probe' },
            { maxVolume: Infinity, recommendation: 'Digital thermometer with multiple probes' }
        ];

        return new EquipmentStrategy('volume', recommendations);
    }

    /**
     * Create circulation pump strategy
     * @returns {EquipmentStrategy} Circulation pump recommendation strategy
     */
    static createCirculationPumpStrategy() {
        const recommendations = [
            { maxVolume: 20, recommendation: '200-400 GPH powerhead' },
            { maxVolume: 55, recommendation: '400-800 GPH powerhead' },
            { maxVolume: 75, recommendation: '800-1200 GPH powerhead or multiple units' },
            { maxVolume: Infinity, recommendation: '1200+ GPH powerhead or multiple units' }
        ];

        return new EquipmentStrategy('dimensions', recommendations);
    }

    /**
     * Create ATO strategy
     * @returns {EquipmentStrategy} Auto top-off recommendation strategy
     */
    static createATOStrategy() {
        const recommendations = [
            { maxArea: 2, recommendation: '1-2 gallon reservoir with small pump' },
            { maxArea: 4, recommendation: '2-5 gallon reservoir with medium pump' },
            { maxArea: Infinity, recommendation: '5+ gallon reservoir with large pump' }
        ];

        return new EquipmentStrategy('surfaceArea', recommendations);
    }
}