# Aquarium Tank Simulator 🐠

A comprehensive web-based platform for aquarium enthusiasts of all levels - from beginners planning their first tank to experts calculating precise specifications. This simulator provides accurate calculations, smart recommendations, and detailed specifications for building custom aquarium tanks.

## Features

### Tank Design & Calculations
- **Flexible Unit System**: Independent controls for dimensions (inches/cm) and volume (gallons/liters)
- **Real-time Calculations**: Instant volume, surface area, and weight calculations as you adjust dimensions
- **Smart Glass Thickness Recommendations**: Based on tank dimensions, panel size, and water depth
- **Glass Panel Calculator**: Detailed dimensions, area, and weight for each glass panel (front, back, sides, bottom)
- **Weight Distribution Calculator**: Calculate total weight and weight per support point for proper stand design
- **Dimension Finder**: Find multiple dimension combinations that match your target volume
- **Aspect Ratio Lock**: Maintain tank proportions when adjusting dimensions

### Planning & Guidance
- **Placement Guide**: Get recommendations for room type, location, power requirements, lighting, access, and spacing
- **Surface Area Analysis**: Evaluate oxygen exchange capacity with visual indicators
- **Water Weight Calculator**: Accurate weight calculations for both freshwater and saltwater
- **Equipment Recommendations**: Filter, heater, chiller, UV sterilizer, air pump, thermometer, circulation pump, and ATO suggestions

### User Experience
- **Tank Presets**: Quick-load common tank sizes (nano, standard, and showpiece tanks)
- **Volume Presets**: Select target volumes and see dimension options
- **Water Level Control**: Adjust water fill percentage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Data Management
- **Save Configurations**: Save unlimited tank configurations with custom names
- **Export/Import**: Backup and restore configurations as JSON files
- **Copy Specifications**: Copy all tank specs to clipboard for easy sharing
- **Export Summary**: Generate a downloadable image with all specifications
- **Privacy First**: All data stored locally in your browser - no tracking or data collection

## Usage

1. Choose your preferred units for dimensions (Inches or Centimeters)
2. Choose your preferred volume unit (Gallons or Liters)
3. Use presets or manually adjust tank dimensions (width, length, height)
4. View real-time calculations for volume, surface area, and weight
5. Check glass thickness recommendations and panel specifications
6. Review equipment recommendations for your tank size
7. Save configurations, export, or copy specifications as needed

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript ES6 Modules
- **Architecture**: Modular design with separation of concerns (calculator, recommender, DOM helper, utilities)
- **Data Storage**: localStorage for saved configurations (fully private, no server transmission)
- **Calculations**: Custom algorithms for volume, glass thickness, and equipment recommendations
- **Enhanced Visualizations**: Advanced data visualizations using D3.js for volume, weight, and glass thickness
- **Performance Optimizations**: Utilizes Lodash for efficient data manipulation and function debouncing
- **Improved Date Handling**: Enhanced date processing with date-fns library
- **No Build Tools**: Pure JavaScript - no compilation or bundling required

## File Structure

```
aquarium-simulation/
├── app/
│   ├── index.html              # Main HTML page
│   ├── css/
│   │   └── styles.css          # Complete styling with responsive design
│   ├── js/
│   │   ├── app.js              # Main application orchestration
│   │   ├── tank-calculator.js  # Volume and weight calculations
│   │   ├── glass-recommendations.js # Glass thickness algorithm
│   │   ├── glass-panel-calculator.js # Individual panel calculations
│   │   ├── equipment-recommendations.js # Equipment suggestions
│   │   ├── equipment-strategy.js # Strategy pattern for equipment
│   │   ├── placement-guide.js # Location and setup recommendations
│   │   ├── dimension-finder.js # Find dimensions for target volume
│   │   ├── constants.js        # Configuration and conversion factors
│   │   ├── dom-helper.js      # DOM manipulation utilities
│   │   ├── utils.js           # Utility functions
│   │   └── logger.js          # Production logging system
│   └── data/
│       ├── constants.json      # Configuration data
│       ├── glass-thickness-recommendations.json
│       ├── equipment-recommendations.json
│       ├── placement-guidelines.json
│       ├── weight-distribution-configs.json
│       └── test-cases.json    # Test data for validation
├── package.json
├── README.md
└── CHANGELOG.md
```

## Running Locally

1. Clone or download the project
2. Open a terminal in the project directory
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
   or
   ```bash
   npm start
   ```
4. Open `http://localhost:8000` in your browser

## Browser Support

- Modern browsers with ES6 module support (Chrome, Firefox, Safari, Edge)
- Responsive design works on mobile and tablet devices
- No external dependencies required

## Development

The project uses vanilla JavaScript with ES6 modules following SOLID principles:
- **No build tools required**: No Webpack, Vite, or bundlers needed
- **Modular architecture**: Clean separation of concerns
- **Strategy pattern**: Pluggable equipment recommendation algorithms
- **Data-driven**: Configuration externalized to JSON files
- **Privacy-first**: All data storage is local to the user's browser

## Testing

Run the test suite:
```bash
npm test
```

## Privacy

This application respects your privacy:
- No tracking, analytics, or data collection
- All configurations stored locally in your browser
- Optional export/import for data backup
- View the Privacy Policy in the app header for details

## License

See LICENSE file for details.