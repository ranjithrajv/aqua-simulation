# Aquarium Simulator - Test Suite

This directory contains all testing and validation files for the aquarium tank simulator.

## Files Overview

### `validate.js`
**Purpose:** Comprehensive validation script that checks:
- JavaScript syntax validation for all modules
- HTML structure integrity (duplicate IDs, balanced tags)
- Module import/export resolution
- Code structure analysis (orphaned code detection)

**Usage:**
```bash
cd tests
node validate.js
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