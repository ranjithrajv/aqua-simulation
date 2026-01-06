# Lodash Integration

## Overview

This project has been integrated with Lodash for efficient data manipulation and utility functions.

## Installation

Lodash is loaded via CDN in `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```

## Usage

### In Modules

Import lodash utilities from `js/utils/lodash-utils.js`:

```javascript
import {
  debounceFunction,
  clamp,
  getValues,
  orderBy,
  filterArray,
  mapArray,
  max,
  min,
  deepClone,
  sortArray,
  groupArray,
  sumArray,
  maxArray,
  minArray,
  removeDuplicates,
  memoizeFunction,
  isEqual,
  difference,
  flattenArray,
  chunk,
} from './utils/lodash-utils.js';
```

### Available Utility Functions

#### Array Operations

- `filterArray(arr, predicate)` - Filter an array
- `mapArray(arr, iteratee)` - Transform an array
- `orderBy(arr, iteratees, orders)` - Sort by multiple criteria
- `sortArray(arr, iteratee, order)` - Sort by single criterion
- `groupArray(arr, iteratee)` - Group array by property
- `removeDuplicates(arr, iteratee)` - Remove duplicates
- `difference(array, values)` - Get array difference
- `flattenArray(array)` - Flatten nested arrays
- `chunk(arr, size)` - Split array into chunks

#### Object Operations

- `getValues(obj)` - Get object values as array
- `getKeys(obj)` - Get object keys as array
- `deepClone(obj)` - Deep clone an object
- `isEqual(value, other)` - Deep equality check

#### Math Operations

- `max(arr)` - Find maximum value
- `min(arr)` - Find minimum value
- `maxArray(arr, iteratee)` - Find max by property
- `minArray(arr, iteratee)` - Find min by property
- `clamp(number, lower, upper)` - Clamp value between bounds
- `sumArray(arr, iteratee)` - Sum values by property

#### Function Utilities

- `debounceFunction(func, wait, options)` - Debounce function calls
- `throttleFunction(func, wait, options)` - Throttle function calls
- `memoizeFunction(func, resolver)` - Cache function results
- `reduceArray(arr, iteratee, initialValue)` - Reduce to single value

## Benefits

- **Performance**: Optimized implementations for common operations
- **Consistency**: Reliable cross-browser behavior
- **Readability**: Clear intent with named functions
- **Reduced Boilerplate**: Less custom utility code

## Examples

### Before (Native JavaScript)

```javascript
configs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const maxDimension = Math.max(dimensions.width, dimensions.length, dimensions.height);
const filtered = configs.filter(c => c.id !== id);
const values = Object.values(DIMENSIONS);
```

### After (Lodash)

```javascript
orderBy(configs, ['createdAt'], ['desc']);
const maxDimension = max([dimensions.width, dimensions.length, dimensions.height]);
const filtered = filterArray(configs, c => c.id !== id);
const values = getValues(DIMENSIONS);
```

## Migrated Code

### app.js

- ✅ `Object.values(DIMENSIONS)` → `getValues(DIMENSIONS)`
- ✅ `configs.sort(...)` → `orderBy(configs, ['createdAt'], ['desc'])`
- ✅ `configs.filter(...)` → `filterArray(configs, ...)`
- ✅ `Math.max(...)` → `max([...])`
- ✅ `Math.max(min, Math.min(max, value))` → `clamp(value, min, max)`

### utils.js

- ✅ Custom `debounce()` → `debounceFunction()` (from lodash)
- ✅ Custom `clamp()` → `clamp()` (from lodash)

## Notes

- Lodash utilities are wrapped in `lodash-utils.js` for consistent naming
- Global `_.` object is also available for any lodash function
- Custom utility functions remain in `utils.js` for DOM-specific operations
