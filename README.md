# Aquarium Tank Simulator 🐠

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

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

## Enhanced Features

### 1. Advanced Data Visualizations
- **Volume Comparison Charts**: Bar charts showing geometric vs. actual water volumes
- **Weight Distribution Charts**: Pie charts showing water vs. glass weight distribution
- **Glass Thickness Visualization**: Line charts showing recommended thickness for each panel

### 2. Improved Data Manipulation
- **Lodash Integration**: Enhanced array/object manipulation capabilities
- **Debounced Functions**: Better performance for frequently called functions
- **Deep Cloning**: Safe copying of complex objects

### 3. Enhanced Date Handling
- **date-fns Integration**: Robust date formatting and manipulation utilities
- **Validation Functions**: Past/future date validation
- **Duration Calculations**: Days between dates, etc.

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
- **Performance Optimizations**: Utilizes Lodash for efficient data manipulation and function debouncing
- **Improved Date Handling**: Enhanced date processing with date-fns library
- **No Build Tools**: Pure JavaScript - no compilation or bundling required

## External Libraries Used

### 1. D3.js (v7.x)
- **Purpose**: Advanced data visualizations
- **Features**: Interactive bar, pie, and line charts
- **Benefits**: Highly customizable and powerful visualization engine

### 2. date-fns (v3.x)
- **Purpose**: Date manipulation and formatting
- **Features**: Date formatting, validation, and calculation utilities
- **Benefits**: Lightweight and modular date library

### 3. Lodash (v4.x)
- **Purpose**: Utility functions for common programming tasks
- **Features**: Array manipulation, object cloning, function debouncing
- **Benefits**: Performance optimizations and code simplification

## File Structure

```
aquarium-simulation/
├── app/
│   ├── index.html              # Main HTML page
│   ├── css/
│   │   ├── modules/            # Modular CSS files
│   │   ├── styles.css          # Complete styling with responsive design
│   │   └── tailwind-custom.css # Custom styles
│   ├── data/                   # JSON configuration files
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
│   │   ├── logger.js          # Production logging system
│   │   └── utils/
│   │       ├── charts.js      # D3 chart utilities
│   │       ├── date-utils.js  # date-fns utilities
│   │       └── lodash-utils.js # Lodash utilities
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── core/               # Core application logic
│   │   ├── domain/             # Domain-specific logic
│   │   ├── services/           # Business services
│   │   ├── ui/                 # UI components
│   │   └── utils/              # Utility functions
│   └── public/
│       └── index.html          # Main entry point
├── tests/                      # Testing infrastructure
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

## Setup

### Install Dependencies
```bash
npm install
```

### Available Scripts
- `npm start` - Start the development server
- `npm test` - Run the test suite
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Automatically fix linting issues
- `npm run format` - Format all files

## Development

The project uses vanilla JavaScript with ES6 modules following SOLID principles:
- **No build tools required**: No Webpack, Vite, or bundlers needed
- **Modular architecture**: Clean separation of concerns
- **Strategy pattern**: Pluggable equipment recommendation algorithms
- **Data-driven**: Configuration externalized to JSON files
- **Privacy-first**: All data storage is local to the user's browser

### Key Improvements

#### 1. Performance Enhancements
- Function debouncing to prevent excessive recalculations
- Efficient data processing with Lodash utilities
- Optimized chart rendering

#### 2. Security Improvements
- Input sanitization and validation
- Content Security Policy implementation
- XSS prevention measures

#### 3. Code Quality
- Modular CSS architecture
- Consistent code formatting with Prettier
- Linting rules enforcement

### Adding New Visualizations
1. Create a new chart function in `app/js/utils/charts.js`
2. Call the function from the `updateVisualizations` method in `app.js`
3. Ensure proper error handling and data validation

## Testing

Run the test suite:
```bash
npm test
```

## GitHub Pages Deployment

To deploy this application to GitHub Pages:

1. **Build for GitHub Pages**:
   ```bash
   npm run build-github-pages
   ```

2. **Configure GitHub Pages in your repository settings**:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose your main branch (e.g., `master`)
   - Select `/ (root)` as the folder
   - Click Save

Your site will be available at `https://<username>.github.io/<repository-name>/`

For detailed instructions, see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md).

## Privacy

This application respects your privacy:
- No tracking, analytics, or data collection
- All configurations stored locally in your browser
- Optional export/import for data backup
- View the Privacy Policy in the app header for details

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.