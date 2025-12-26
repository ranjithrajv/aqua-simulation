# Aquarium Tank Simulator

A web-based aquarium tank simulator that provides 3D visualization and glass thickness recommendations based on tank dimensions.

## Features

- **3D Tank Visualization**: Interactive 3D preview of your aquarium tank using Three.js
- **Flexible Unit System**: Independent controls for dimensions (inches/cm) and volume (gallons/liters)
- **Real-time Calculations**: Volume calculations with automatic unit conversion
- **Smart Glass Thickness Recommendations**: Based on tank dimensions, panel size, and water depth
- **Safety Notes**: Contextual recommendations for bracing and professional consultation
- **Responsive Design**: Works on desktop and mobile devices
- **Wireframe Toggle**: Switch between solid and wireframe views

## Usage

1. Choose your preferred units for dimensions (Inches or Centimeters)
2. Choose your preferred primary volume unit (Gallons or Liters)
3. Adjust the tank dimensions using the sliders (width, length, height)
4. View the 3D preview update in real-time
5. Check the volume calculations and glass thickness recommendations
6. Toggle wireframe mode for a different view

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript ES6 Modules
- **3D Graphics**: Three.js with OrbitControls
- **Calculations**: Custom algorithms for volume and glass recommendations
- **No Build Tools**: Pure JavaScript with CDN dependencies

## File Structure

```
aquarium-simulator/
├── index.html              # Main HTML page
├── css/
│   └── styles.css          # Styling and responsive design
└── js/
    ├── app.js              # Main application orchestration
    ├── tank-calculator.js  # Volume calculation utilities
    ├── glass-recommendations.js # Glass thickness recommendations
    └── tank-visualizer.js  # Three.js 3D visualization
```

## Running Locally

1. Clone or download the project
2. Open a terminal in the project directory
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser

## Browser Support

- Modern browsers with ES6 module support
- WebGL enabled for 3D visualization
- Responsive design works on mobile devices

## Development

The project uses vanilla JavaScript with ES6 modules. No build tools or package managers are required. Three.js is loaded via CDN.