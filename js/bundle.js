// Simple test bundle
console.log('Test bundle loading...');

// Simple test function
function testBundle() {
    console.log('Test bundle function called');
    const title = document.querySelector('h1');
    if (title) {
        title.style.color = 'red';
        title.textContent = 'Aquarium Tank Simulator - JS WORKING!';
    }
    
    // Try to update a simple element
    const surfaceAreaElement = document.getElementById('surfaceAreaResult');
    if (surfaceAreaElement) {
        surfaceAreaElement.textContent = 'TEST - JS is working!';
    }
}

// Try multiple ways to initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testBundle);
} else {
    testBundle();
}

console.log('Test bundle loaded');
