# Migration Plan: Vite + Restructure

## Overview

Gradually migrate the Aquarium Tank Simulator to use Vite as the build tool and restructure the codebase for better maintainability.

**Timeline**: 3-4 weeks
**Approach**: Gradual migration (Option A)
**Risk Level**: Low (changes made incrementally with fallbacks)

---

## Phase 1: Setup & Configuration (Week 1)

### Step 1.1: Initialize Vite Project

**Status**: Not Started
**Estimated Time**: 30 minutes

```bash
# From /home/ranjithraj/projects/aquarium/aqua-simulation/app
npm init -y
npm install -D vite @vitejs/plugin-basic-ssl
npm install -D vitest @vitest/ui jsdom
npm install lodash
```

**Files to Create**:

- `package.json`
- `vite.config.js`
- `.gitignore`

**Migration Tasks**:

1. Create package.json with dependencies
2. Create vite.config.js with appropriate settings
3. Move CDN libraries to npm packages
4. Update imports in existing code
5. Keep existing HTML structure initially

**Risk**: Low - existing code still works during setup

---

### Step 1.2: Configure Vite for ES Modules

**Status**: Not Started
**Estimated Time**: 1 hour

**vite.config.js**:

```javascript
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: '../public/index.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

**Tasks**:

1. Move `index.html` to `public/`
2. Update CDN scripts to npm imports
3. Configure Tailwind with PostCSS
4. Test build process

---

## Phase 2: Directory Structure Migration (Week 1-2)

### Step 2.1: Create New Directory Structure

**Status**: Not Started
**Estimated Time**: 2 hours

```bash
mkdir -p src/{core,domain/{calculations,recommendations,strategies},ui/{components,visualizations/charts,tank-preview,utils},services,config,utils}
mkdir -p public/data
mkdir -p styles/{components,themes}
mkdir -p tests/{unit/{calculations,domain,utils},integration}
mkdir -p docs/migration-guides
mkdir -p scripts
```

**Migration Tasks**:

1. Create all directories
2. Move existing files to new locations (no code changes yet)
3. Update import paths in moved files
4. Test that app still works

---

### Step 2.2: Move Files to New Structure

**Status**: Not Started
**Estimated Time**: 3 hours

**File Mapping**:

| Current                               | New Location                                         |
| ------------------------------------- | ---------------------------------------------------- |
| `js/tank-calculator.js`               | `src/domain/calculations/TankCalculator.js`          |
| `js/glass-panel-calculator.js`        | `src/domain/calculations/GlassPanelCalculator.js`    |
| `js/weight-distribution-configs.json` | Move to `public/data/` (already there)               |
| `js/glass-recommendations.js`         | `src/domain/recommendations/GlassRecommender.js`     |
| `js/equipment-recommendations.js`     | `src/domain/recommendations/EquipmentRecommender.js` |
| `js/placement-guide.js`               | `src/domain/recommendations/PlacementGuide.js`       |
| `js/equipment-strategy.js`            | `src/domain/strategies/EquipmentStrategy.js`         |
| `js/dimension-finder.js`              | `src/domain/calculations/DimensionFinder.js`         |
| `js/constants.js`                     | `src/config/constants.js`                            |
| `js/logger.js`                        | `src/utils/logger.js`                                |
| `js/dom-helper.js`                    | `src/ui/utils/DOMHelper.js`                          |
| `js/utils/charts.js`                  | `src/ui/visualizations/charts/` (split into files)   |
| `js/utils.js`                         | `src/utils/formatters.js` (keep core utilities)      |
| `js/utils/lodash-utils.js`            | `src/utils/lodash-utils.js`                          |
| `css/tailwind-custom.css`             | `styles/tailwind.css`                                |
| `css/modules-backup/*`                | `styles/components/` (if useful)                     |
| `data/*`                              | `public/data/` (already there)                       |
| `TECH_STACK_SUMMARY.md`               | `docs/migration-guides/TECH_STACK_SUMMARY.md`        |
| `REFACTORING_SUMMARY.md`              | `docs/migration-guides/REFACTORING_SUMMARY.md`       |
| `TAILWIND_MIGRATION.md`               | `docs/migration-guides/TAILWIND_MIGRATION.md`        |

---

### Step 2.3: Update Import Paths

**Status**: Not Started
**Estimated Time**: 2 hours

**Script**: `scripts/update-imports.js`

```javascript
const importMappings = {
  './tank-calculator.js': './domain/calculations/TankCalculator.js',
  './glass-panel-calculator.js': './domain/calculations/GlassPanelCalculator.js',
  // ... all other mappings
};
```

**Tasks**:

1. Run import update script
2. Manually verify critical files
3. Test app functionality

---

## Phase 3: Component Extraction (Week 2-3)

### Step 3.1: Extract State Management

**Status**: Not Started
**Estimated Time**: 4 hours

**New File**: `src/core/StateManager.js`

```javascript
export class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    const oldState = this.state;
    this.state = { ...this.state, ...updates };
    this.notify(oldState, this.state);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(oldState, newState) {
    this.listeners.forEach(listener => listener(oldState, newState));
  }
}
```

**Refactor**:

1. Extract state from `AquariumApp` class
2. Use StateManager for dimensions, units, water type, etc.
3. Update state changes to use `setState()`
4. Verify state updates propagate correctly

---

### Step 3.2: Extract DimensionControls Component

**Status**: Not Started
**Estimated Time**: 3 hours

**New File**: `src/ui/components/DimensionControls.js`

```javascript
import { DOMHelper } from '../utils/DOMHelper.js';
import { DIMENSIONS } from '../../config/constants.js';

export class DimensionControls {
  constructor(stateManager, onDimensionChange) {
    this.stateManager = stateManager;
    this.onDimensionChange = onDimensionChange;
    this.init();
  }

  init() {
    const dimensions = ['width', 'length', 'height'];
    dimensions.forEach(dim => this.setupDimensionControl(dim));
  }

  setupDimensionControl(dim) {
    const input = document.getElementById(dim);
    if (!input) return;

    input.addEventListener('input', e => {
      const value = parseFloat(e.target.value);
      DOMHelper.setText(`${dim}Value`, value);
      this.onDimensionChange(dim, value);
    });
  }

  updateDimension(dim, value) {
    DOMHelper.updateDimensionDisplay(dim, value);
  }

  setEnabled(enabled) {
    const dimensions = ['width', 'length', 'height'];
    dimensions.forEach(dim => {
      const input = document.getElementById(dim);
      if (input) input.disabled = !enabled;
    });
  }
}
```

**Refactor**:

1. Extract `setupDimensionControls()` and related methods from `app.js`
2. Create new component
3. Wire up in `AquariumApp`
4. Test functionality

---

### Step 3.3: Extract VolumeControls Component

**Status**: Not Started
**Estimated Time**: 2 hours

**New File**: `src/ui/components/VolumeControls.js`

**Similar to DimensionControls**

1. Extract volume input handling
2. Extract water volume input handling
3. Create component class
4. Wire up and test

---

### Step 3.4: Extract ResultsSection Component

**Status**: Not Started
**Estimated Time**: 3 hours

**New File**: `src/ui/components/ResultsSection.js`

**Responsibilities**:

- Display volume calculations
- Display surface area
- Display glass recommendations
- Display equipment recommendations
- Update visualizations

---

### Step 3.5: Extract SavedConfigs Component

**Status**: Not Started
**Estimated Time**: 3 hours

**New File**: `src/ui/components/SavedConfigs.js`

**Responsibilities**:

- Render saved configurations list
- Handle save dialog
- Handle load configuration
- Handle delete configuration
- Handle export/import

---

### Step 3.6: Extract Modals

**Status**: Not Started
**Estimated Time**: 2 hours

**New Files**:

- `src/ui/components/Modals/SaveDialog.js`
- `src/ui/components/Modals/PrivacyModal.js`

**Refactor**:

1. Extract modal creation logic from `app.js`
2. Create reusable modal base class
3. Implement specific modals
4. Add SweetAlert2 for better UX

---

### Step 3.7: Extract Charts into Separate Files

**Status**: Not Started
**Estimated Time**: 2 hours

**New Files**:

- `src/ui/visualizations/charts/VolumeChart.js`
- `src/ui/visualizations/charts/WeightChart.js`
- `src/ui/visualizations/charts/GlassThicknessChart.js`
- `src/ui/visualizations/charts/index.js`

**Refactor**:

1. Split `charts.js` into individual chart files
2. Consider switching to Chart.js (simpler than D3)
3. Update imports
4. Test all charts

---

### Step 3.8: Create Service Layer

**Status**: Not Started
**Estimated Time**: 4 hours

**New Files**:

- `src/services/StorageService.js`
- `src/services/ClipboardService.js`
- `src/services/ExportService.js`
- `src/services/ValidationService.js`

**StorageService.js**:

```javascript
export class StorageService {
  constructor(key = 'aquariumConfigs') {
    this.key = key;
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return [];
    }
  }

  save(configs) {
    try {
      localStorage.setItem(this.key, JSON.stringify(configs));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  add(config) {
    const configs = this.getAll();
    configs.push(config);
    return this.save(configs);
  }

  delete(id) {
    const configs = this.getAll().filter(c => c.id !== id);
    return this.save(configs);
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}
```

**Refactor**:

1. Extract localStorage operations from `app.js`
2. Extract clipboard operations
3. Extract export functionality
4. Extract validation logic
5. Update `app.js` to use services

---

## Phase 4: Testing (Week 3-4)

### Step 4.1: Setup Vitest

**Status**: Not Started
**Estimated Time**: 1 hour

**Tasks**:

1. Configure Vitest in `vite.config.js`
2. Create test setup file
3. Add test scripts to package.json

**package.json**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

---

### Step 4.2: Write Unit Tests for Calculations

**Status**: Not Started
**Estimated Time**: 6 hours

**Test Files**:

- `tests/unit/calculations/TankCalculator.test.js`
- `tests/unit/calculations/GlassPanelCalculator.test.js`
- `tests/unit/calculations/DimensionFinder.test.js`

**Example Test**:

```javascript
import { describe, it, expect } from 'vitest';
import { TankCalculator } from '../../../src/domain/calculations/TankCalculator.js';

describe('TankCalculator', () => {
  it('calculates volume correctly', () => {
    const calculator = new TankCalculator();
    const volume = calculator.calculateVolume(48, 24, 24);
    expect(volume).toBeCloseTo(190.0, 1); // ~190 liters
  });

  it('converts gallons to liters correctly', () => {
    const calculator = new TankCalculator();
    const liters = calculator.convertToGallons(50);
    expect(liters).toBeCloseTo(18.9, 1);
  });

  it('throws error for negative dimensions', () => {
    const calculator = new TankCalculator();
    expect(() => calculator.calculateVolume(-10, 20, 30)).toThrow();
  });
});
```

---

### Step 4.3: Write Unit Tests for Recommendations

**Status**: Not Started
**Estimated Time**: 4 hours

**Test Files**:

- `tests/unit/domain/GlassRecommender.test.js`
- `tests/unit/domain/EquipmentRecommender.test.js`
- `tests/unit/domain/PlacementGuide.test.js`

---

### Step 4.4: Write Unit Tests for Services

**Status**: Not Started
**Estimated Time**: 3 hours

**Test Files**:

- `tests/unit/services/StorageService.test.js`
- `tests/unit/services/ClipboardService.test.js`
- `tests/unit/services/ValidationService.test.js`

---

### Step 4.5: Write Integration Tests

**Status**: Not Started
**Estimated Time**: 4 hours

**Test Files**:

- `tests/integration/AquariumApp.test.js`
- `tests/integration/ExportService.test.js`

---

## Phase 5: Enhancements (Week 4+)

### Step 5.1: Add SweetAlert2

**Status**: Not Started
**Estimated Time**: 2 hours

**Tasks**:

1. `npm install sweetalert2`
2. Replace custom toasts with SweetAlert2
3. Replace custom modals with SweetAlert2
4. Replace custom confirms with SweetAlert2

---

### Step 5.2: Add PDF Export

**Status**: Not Started
**Estimated Time**: 3 hours

**Tasks**:

1. `npm install jspdf jspdf-autotable`
2. Implement PDF export in ExportService
3. Add PDF export button to UI
4. Test PDF generation

---

### Step 5.3: Add 3D Tank Visualization

**Status**: Not Started
**Estimated Time**: 8 hours

**Tasks**:

1. `npm install three`
2. Create `src/ui/visualizations/tank-preview/TankVisualizer.js`
3. Implement 3D tank rendering with current dimensions
4. Add rotation controls
5. Add to UI

---

### Step 5.4: Add Professional Icons

**Status**: Not Started
**Estimated Time**: 2 hours

**Tasks**:

1. `npm install phosphor-icons`
2. Replace emoji icons with Phosphor icons
3. Update Tailwind config for icon sizes
4. Test accessibility

---

## Phase 6: Documentation & Cleanup (Week 4)

### Step 6.1: Update Documentation

**Status**: Not Started
**Estimated Time**: 3 hours

**Files to Create**:

- `docs/architecture.md` - System architecture overview
- `docs/api.md` - API documentation
- `docs/contribution.md` - Contribution guidelines

**Files to Update**:

- `README.md` - Main README
- Move existing MD files to `docs/migration-guides/`

---

### Step 6.2: Cleanup

**Status**: Not Started
**Estimated Time**: 2 hours

**Tasks**:

1. Remove unused files (modules-backup, old CSS)
2. Remove duplicate code
3. Format code with Prettier
4. Run linter and fix issues
5. Final build and test

---

## Step 6.3: Final Testing & Deployment

**Status**: Not Started
**Estimated Time**: 4 hours

**Tasks**:

1. Run full test suite
2. Manual testing of all features
3. Build production bundle
4. Test production build locally
5. Deploy to staging
6. Final smoke test
7. Deploy to production

---

## Success Criteria

### Must Have

- [ ] Vite build working without errors
- [ ] All existing functionality working
- [ ] New directory structure implemented
- [ ] State management extracted and working
- [ ] At least 5 major components extracted
- [ ] Service layer created
- [ ] Unit tests for all calculators (80%+ coverage)
- [ ] Documentation updated

### Nice to Have

- [ ] Integration tests for major flows
- [ ] 3D tank visualization
- [ ] PDF export
- [ ] SweetAlert2 integration
- [ ] Professional icons
- [ ] 90%+ test coverage

---

## Rollback Plan

If critical issues arise:

1. **Git Branch Strategy**: Work on feature branch `vite-migration`
2. **Keep Original**: Keep `js/` and `css/` directories until migration complete
3. **Incremental Commits**: Commit after each phase
4. **Easy Rollback**: `git checkout main` to return to working state

---

## Progress Tracking

| Phase | Step | Status      | Notes |
| ----- | ---- | ----------- | ----- |
| 1     | 1.1  | Not Started |       |
| 1     | 1.2  | Not Started |       |
| 2     | 2.1  | Not Started |       |
| 2     | 2.2  | Not Started |       |
| 2     | 2.3  | Not Started |       |
| 3     | 3.1  | Not Started |       |
| 3     | 3.2  | Not Started |       |
| 3     | 3.3  | Not Started |       |
| 3     | 3.4  | Not Started |       |
| 3     | 3.5  | Not Started |       |
| 3     | 3.6  | Not Started |       |
| 3     | 3.7  | Not Started |       |
| 3     | 3.8  | Not Started |       |
| 4     | 4.1  | Not Started |       |
| 4     | 4.2  | Not Started |       |
| 4     | 4.3  | Not Started |       |
| 4     | 4.4  | Not Started |       |
| 4     | 4.5  | Not Started |       |
| 5     | 5.1  | Not Started |       |
| 5     | 5.2  | Not Started |       |
| 5     | 5.3  | Not Started |       |
| 5     | 5.4  | Not Started |       |
| 6     | 6.1  | Not Started |       |
| 6     | 6.2  | Not Started |       |
| 6     | 6.3  | Not Started |       |

---

## Next Actions

1. **Review this plan** with stakeholders
2. **Create git branch**: `git checkout -b vite-migration`
3. **Start Phase 1, Step 1.1**: Initialize Vite Project
4. **Update progress tracking** as you complete each step

---

## Questions & Notes

- **Browser Support**: Modern browsers only (Vite default)
- **Testing Framework**: Vitest (paired with Vite)
- **Migration Pace**: Gradual (safer, allows testing at each phase)
- **Deployment**: Need to confirm deployment target for build config

_Last Updated: 2025-01-06_
