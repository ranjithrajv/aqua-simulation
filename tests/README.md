# Aquarium Simulator - Test Suite

This directory contains comprehensive test files for the aquarium tank simulator.

## Files Overview

### `test-volume-calculations.js`
**Purpose:** Comprehensive test suite for all calculation functionality with mocked DOM
- Tests volume calculations, conversions, and recommendations
- Tests glass recommendations and panel dimensions
- Tests glass weight calculations
- Tests weight distribution calculations
- Tests equipment recommendations for all equipment types
- Tests preset button functionality
- Validates core mathematical functions and logic
- Runs in Node.js environment with DOM simulation
- Includes comprehensive test coverage with pass/fail reporting

**Usage:**
```bash
cd tests
node test-volume-calculations.js
```

## Running All Tests

```bash
# From project root
cd /home/ranjithraj/projects/aquarium/aqua-simulation

# Run comprehensive test suite
node tests/test-volume-calculations.js

# Run integration tests (requires browser)
python3 -m http.server 8001
# Then open http://localhost:8001/tests/test.html
```

## Test Coverage

- ✅ JavaScript syntax validation
- ✅ HTML structure validation
- ✅ Module import/export resolution
- ✅ Core calculation logic
- ✅ Equipment recommendation logic
- ✅ DOM manipulation utilities
- ✅ 3D visualization integration
- ✅ UI interaction and updates
- ✅ Glass panel dimension calculations
- ✅ Weight distribution calculations
- ✅ Preset functionality

## CI/CD Integration

The test files are ready for CI/CD integration:
```yaml
# Example GitHub Actions
- name: Run Tests
  run: node tests/test-volume-calculations.js
```

**Note:** The test files use CommonJS `require()` for imports. Node.js requires a `package.json` file with `"type": "module"` to use ES6 `import/export` syntax. 

**Current Limitations:**
- Tests run in Node.js environment with mocked DOM
- Cannot test browser-specific features in Node.js
- For browser testing, open `test.html` in a web server

**To run tests with ES6 support:**
1. Add `package.json` to project root with:
   ```json
   {
     "type": "module"
   }
   ```

2. Or rename test files from `.js` to `.mjs`

**To add package.json:**
```bash
echo '{"type":"module"}' > package.json
```

### `test.html`
**Purpose:** Browser-based integration test for calculation functionality
- Interactive test page with dimension sliders
- Tests real-time calculation updates
- Validates UI interaction and display updates
- Legacy integration test (see test-volume-calculations.js for comprehensive tests)

### `test-controls.html`
**Purpose:** Documentation and testing guide for 3D visualization controls
- Describes all available 3D control features
- Provides testing instructions
- Links to main application for testing

### `validate.js`
**Purpose:** Comprehensive validation script that checks:
- JavaScript syntax validation for all modules
- HTML structure integrity (duplicate IDs, balanced tags)
- Module import/export resolution
- Code structure analysis (orphaned code detection)

## Running All Tests

```bash
# From project root
cd /home/ranjithraj/projects/aquarium/aqua-simulation

# Run comprehensive validation
node tests/validate.js

# Run comprehensive test suite
node tests/test-volume-calculations.js

# Run integration tests (requires browser)
python3 -m http.server 8001
# Then open http://localhost:8001/tests/test.html
```

### `test-calculations.js`
**Purpose:** Unit tests for calculation logic with mocked DOM
- Tests volume calculations, conversions, and recommendations
- Runs in Node.js environment with DOM simulation
- Validates core mathematical functions

**Usage:**
```bash
cd tests
node test-calculations.js
```

### `test.html`
**Purpose:** Browser-based integration test for calculation functionality
- Interactive test page with dimension sliders
- Tests real-time calculation updates
- Validates UI interaction and display updates

**Usage:**
```bash
cd tests
python3 -m http.server 8001
# Open http://localhost:8001/tests/test.html
```

### `test-controls.html`
**Purpose:** Documentation and testing guide for 3D visualization controls
- Describes all available 3D control features
- Provides testing instructions
- Links to main application for testing

**Usage:**
```bash
cd tests
python3 -m http.server 8001
# Open http://localhost:8001/tests/test-controls.html
```

## Running All Tests

```bash
# From project root
cd /home/ranjithraj/projects/aquarium/aqua-simulation

# Run comprehensive validation
node tests/validate.js

# Run unit tests
node tests/test-calculations.js

# Run integration tests (requires browser)
python3 -m http.server 8001
# Then open http://localhost:8001/tests/test.html
```

## Test Coverage

- ✅ JavaScript syntax validation
- ✅ HTML structure validation
- ✅ Module import/export validation
- ✅ Core calculation logic
- ✅ Equipment recommendation logic
- ✅ DOM manipulation utilities
- ✅ 3D visualization integration
- ✅ UI interaction and updates

## Adding New Tests

When adding new test files:
1. Place them in this `tests/` directory
2. Update import paths to use `../js/` relative paths
3. Add documentation to this README
4. Update the `validate.js` script if needed

## CI/CD Integration

The `validate.js` script can be integrated into CI/CD pipelines for automated validation:

```yaml
# Example GitHub Actions
- name: Run Validation
  run: node tests/validate.js
```