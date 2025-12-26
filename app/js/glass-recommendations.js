// Glass thickness recommendations based on tank volume and depth
export class GlassRecommender {
    constructor() {
        // Glass thickness recommendations based on research
        this.recommendations = [
            { maxDepth: 12, maxVolume: 20, thickness: 3, description: '3mm (for nano tanks only)' },
            { maxDepth: 15, maxVolume: 40, thickness: 5, description: '5mm (small tanks)' },
            { maxDepth: 24, maxVolume: 100, thickness: 6, description: '6mm (small-medium tanks)' },
            { maxDepth: 30, maxVolume: 200, thickness: 8, description: '8mm (medium tanks)' },
            { maxDepth: 36, maxVolume: 400, thickness: 10, description: '10mm (large tanks)' },
            { maxDepth: 48, maxVolume: Infinity, thickness: 12, description: '12mm+ (extra large tanks)' }
        ];
    }

    /**
     * Get glass thickness recommendation based on tank dimensions
     * @param {number} length - Tank length in inches
     * @param {number} width - Tank width in inches
     * @param {number} height - Tank height in inches
     * @returns {string} Glass thickness recommendation
     */
    getRecommendation(length, width, height) {
        // Calculate the maximum panel dimension (longest side of any panel)
        const maxPanelDimension = Math.max(length, width);

        // Use the glass thickness recommendations based on both depth and panel size
        let recommendedThickness = this.getThicknessForDimensions(height, maxPanelDimension);

        // Add safety considerations for very large panels
        if (maxPanelDimension > 60) {
            // For panels over 5 feet, consider additional bracing or thicker glass
            recommendedThickness = Math.max(recommendedThickness, 10);
        }

        // Return the description for the recommended thickness
        const thicknessRec = this.recommendations.find(rec => rec.thickness === recommendedThickness);
        return thicknessRec ? thicknessRec.description : this.recommendations[this.recommendations.length - 1].description;
    }

    /**
     * Calculate recommended glass thickness based on depth and panel size
     * @param {number} depth - Water depth in inches
     * @param {number} panelSize - Longest panel dimension in inches
     * @returns {number} Recommended thickness in mm
     */
    getThicknessForDimensions(depth, panelSize) {
        // Base thickness on depth (primary factor)
        let baseThickness;

        if (depth <= 12) baseThickness = 3;
        else if (depth <= 15) baseThickness = 5;
        else if (depth <= 24) baseThickness = 6;
        else if (depth <= 30) baseThickness = 8;
        else if (depth <= 36) baseThickness = 10;
        else baseThickness = 12;

        // Increase thickness for larger panels (span stress)
        if (panelSize > 48) baseThickness += 2; // Add 2mm for panels over 4 feet
        if (panelSize > 60) baseThickness += 2; // Add another 2mm for panels over 5 feet

        // Cap at maximum recommended thickness
        return Math.min(baseThickness, 12);
    }

    /**
     * Get detailed recommendation with safety notes
     * @param {number} length - Tank length in inches
     * @param {number} width - Tank width in inches
     * @param {number} height - Tank height in inches
     * @returns {object} Detailed recommendation with notes
     */
    getDetailedRecommendation(length, width, height) {
        const thickness = this.getRecommendation(length, width, height);
        const maxPanelDimension = Math.max(length, width);

        let safetyNote = '';
        if (height > 36 || maxPanelDimension > 60) {
            safetyNote = 'Consider professional consultation for tanks over 36" deep or panels over 5\' long.';
        } else if (height > 24 || maxPanelDimension > 48) {
            safetyNote = 'Ensure proper bracing and frame support for optimal safety.';
        }

        const considerations = [
            'Always use tempered or laminated glass for safety',
            'Consider professional installation for larger tanks',
            'Regular inspection of seals and supports recommended'
        ];

        // Add panel-specific considerations
        if (maxPanelDimension > 48) {
            considerations.push('Extra reinforcement recommended for panels over 4 feet long');
        }

        return {
            thickness: thickness,
            safetyNote: safetyNote,
            considerations: considerations
        };
    }

    /**
     * Check if tank dimensions require special consideration
     * @param {number} length - Tank length in inches
     * @param {number} width - Tank width in inches
     * @param {number} height - Tank height in inches
     * @returns {boolean} True if special consideration needed
     */
    requiresSpecialAttention(length, width, height) {
        const maxPanelDimension = Math.max(length, width);
        return height > 36 || maxPanelDimension > 60;
    }
}