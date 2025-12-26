// Simple test script to simulate the DOM and test calculations
import { TankCalculator } from '../app/js/tank-calculator.js';
import { GlassRecommender } from '../app/js/glass-recommendations.js';

// Mock DOM elements
global.document = {
    getElementById: function(id) {
        const mockElements = {
            'width': { value: '48' },
            'length': { value: '24' },
            'height': { value: '24' },
            'volumeResult': { textContent: '--' },
            'waterVolumeResult': { textContent: '--' },
            'glassResult': { textContent: '--' },
            'glassNotes': { textContent: '--' }
        };
        return mockElements[id] || null;
    }
};

// Test the calculation logic
const calculator = new TankCalculator();
const recommender = new GlassRecommender();

// Simulate updateCalculations
function updateCalculations() {
    console.log('Testing updateCalculations...');

    let width = parseFloat(document.getElementById('width').value);
    let length = parseFloat(document.getElementById('length').value);
    let height = parseFloat(document.getElementById('height').value);

    console.log('Dimensions:', { width, length, height });

    // Calculate volume
    const volumeLiters = calculator.calculateVolume(length, width, height);
    const volumeGallons = calculator.convertToGallons(volumeLiters);
    const waterLiters = calculator.adjustForDisplacement(volumeLiters);

    // Get glass recommendation
    const glassRecommendation = recommender.getRecommendation(length, width, height);
    const detailedRecommendation = recommender.getDetailedRecommendation(length, width, height);

    console.log('Calculated values:', {
        volumeLiters,
        volumeGallons,
        waterLiters,
        glassRecommendation,
        safetyNote: detailedRecommendation.safetyNote
    });

    // Update displays (gallons first)
    const waterGallons = calculator.convertToGallons(waterLiters);
    document.getElementById('volumeResult').textContent = `${volumeGallons.toFixed(1)} gal (${volumeLiters.toFixed(1)} L)`;
    document.getElementById('waterVolumeResult').textContent = `${waterGallons.toFixed(1)} gal (${waterLiters.toFixed(1)} L)`;
    document.getElementById('glassResult').textContent = glassRecommendation;
    document.getElementById('glassNotes').textContent = detailedRecommendation.safetyNote || 'Standard aquarium glass recommended';

    console.log('DOM updated:');
    console.log('volumeResult:', document.getElementById('volumeResult').textContent);
    console.log('waterVolumeResult:', document.getElementById('waterVolumeResult').textContent);
    console.log('glassResult:', document.getElementById('glassResult').textContent);
    console.log('glassNotes:', document.getElementById('glassNotes').textContent);
}

updateCalculations();