# Aquarium Simulation - Enhanced Version

This enhanced version of the Aquarium Simulation app includes additional features and improvements using external libraries to boost functionality and stability.

## New Features

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

## Key Improvements

### 1. Performance Enhancements
- Function debouncing to prevent excessive recalculations
- Efficient data processing with Lodash utilities
- Optimized chart rendering

### 2. Security Improvements
- Input sanitization and validation
- Content Security Policy implementation
- XSS prevention measures

### 3. Code Quality
- Modular CSS architecture
- Consistent code formatting with Prettier
- Linting rules enforcement

## Architecture

### Directory Structure
```
app/
├── css/
│   ├── modules/          # Modular CSS files
│   ├── styles.css        # Main CSS file
│   └── tailwind-custom.css # Custom styles
├── data/                 # JSON data files
├── js/
│   ├── utils/
│   │   ├── charts.js     # D3 chart utilities
│   │   ├── date-utils.js # date-fns utilities
│   │   └── lodash-utils.js # Lodash utilities
│   └── *.js              # Main application files
└── index.html
```

### New Utility Modules
- `charts.js`: D3.js visualization functions
- `date-utils.js`: date-fns wrapper functions
- `lodash-utils.js`: Lodash utility functions

## Usage

The application automatically integrates the new features. Charts update in real-time as you modify tank dimensions, and all new utility functions are available throughout the codebase.

## Development

### Adding New Visualizations
1. Create a new chart function in `app/js/utils/charts.js`
2. Call the function from the `updateVisualizations` method in `app.js`
3. Ensure proper error handling and data validation

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
MIT License - see LICENSE file for details.