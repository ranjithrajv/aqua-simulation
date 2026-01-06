# Changelog

All notable changes to the Aquarium Simulation project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-06

### Added
- JSON data files for configuration and data storage:
  - `app/data/constants.json` - Unit conversions and default values
  - `app/data/equipment-recommendations.json` - Equipment recommendation data
  - `app/data/glass-thickness-recommendations.json` - Glass thickness recommendations
  - `app/data/placement-guidelines.json` - Placement guidelines
  - `app/data/test-cases.json` - Test cases
  - `app/data/weight-distribution-configs.json` - Weight distribution configurations
- Modular CSS system:
  - Split large CSS file into 12 modular files for better maintainability
  - Created `app/css/modules/` directory with separate files for different components
  - Updated main CSS file to use `@import` statements for modules
- Error handling improvements:
  - Added try-catch blocks for localStorage operations in `app.js`
  - Added input validation and error boundaries for calculation methods in `tank-calculator.js`
  - Improved error handling in `logger.js` for Node.js environment
- Code quality tools:
  - Added ESLint configuration file (`.eslintrc.json`)
  - Added Prettier configuration file (`.prettierrc`)
  - Added linting and formatting scripts to `package.json`

### Changed
- Refactored JavaScript files to load data from JSON files:
  - `app/js/constants.js` - Now loads constants from JSON with fallback
  - `app/js/equipment-strategy.js` - Now loads equipment recommendations from JSON
  - `app/js/glass-recommendations.js` - Now loads glass recommendations from JSON
  - `app/js/placement-guide.js` - Now loads placement guidelines from JSON
  - `app/js/glass-panel-calculator.js` - Now loads weight distribution configs from JSON
  - `app/js/app.js` - Added JSON preloading functionality
- Created utility function for JSON loading:
  - Added `app/js/utils/json-loader.js` with reusable JSON loading functions
- Updated HTML structure:
  - Fixed duplicate HTML elements in `index.html` volume preset section
  - Removed duplicate 20 gal and 10 gal preset buttons

### Fixed
- Fixed duplicate HTML elements in index.html (lines 199, 207, 214)
- Fixed localStorage operations to handle quota exceeded errors
- Fixed error handling in calculation methods to prevent crashes
- Fixed logger.js to work properly in both browser and Node.js environments
- Improved robustness of JSON loading with fallback mechanisms

### Security
- Added proper error handling to prevent crashes from localStorage quota exceeded errors
- Added input validation to calculation methods to prevent invalid operations

### Performance
- Modular CSS system improves maintainability and potential for selective loading
- JSON-based configuration allows for easier updates without code changes
- Improved error handling prevents application crashes from invalid inputs

### Code Quality
- Eliminated DRY violations by creating reusable JSON loading utility
- Improved separation of concerns with modular CSS
- Added linting and formatting standards
- Enhanced error handling throughout the application