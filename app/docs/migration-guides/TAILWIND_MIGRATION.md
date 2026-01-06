# Tailwind CSS Migration

## Overview

This project has been refactored to use Tailwind CSS for styling instead of custom CSS classes.

## Changes Made

### 1. HTML Updates

- Added Tailwind CSS CDN via `<script src="https://cdn.tailwindcss.com"></script>`
- Configured Tailwind theme with custom colors matching original design
- Replaced custom CSS classes with Tailwind utility classes throughout `index.html`
- Updated sections including:
  - Header and navigation
  - Input forms and sliders
  - Results display
  - Glass panels grid
  - Weight distribution cards
  - Placement guide
  - Equipment recommendations
  - Saved configurations

### 2. CSS Updates

- Created new `css/tailwind-custom.css` for styles that Tailwind doesn't handle:
  - Custom range slider styling (web-kit and moz)
  - Tooltip hover states
  - Dimension finder result cards
  - Equipment item styles
  - Support recommendation cards
  - Print and media query styles

### 3. Color Configuration

Custom colors configured in Tailwind:

```javascript
colors: {
    primary: '#667eea',
    'primary-dark': '#5a67d8',
    'primary-light': '#8b9cf7',
    success: '#27ae60',
    'success-light': '#4CAF50',
    warning: '#f39c12',
    error: '#e74c3c',
}
```

## Benefits

- **Smaller CSS bundle**: Most styles handled by utility classes
- **Consistent design system**: Tailwind's utility classes ensure consistency
- **Easier maintenance**: Changes can be made directly in HTML
- **Better performance**: CDN loads optimized styles
- **Responsive design**: Built-in responsive utilities

## Maintenance

When making style changes:

1. Prefer Tailwind utility classes in HTML
2. Use `tailwind-custom.css` only for styles Tailwind can't handle (e.g., custom form inputs, complex animations)
3. Reference Tailwind documentation: https://tailwindcss.com/docs

## Removed CSS Modules

The following CSS modules are no longer needed (can be deleted if desired):

- `css/modules/base.css`
- `css/modules/header.css`
- `css/modules/layout.css`
- `css/modules/input.css`
- `css/modules/results.css`
- `css/modules/equipment.css`
- `css/modules/visualization.css`
- `css/modules/tooltip.css`
- `css/modules/animations.css`
- `css/modules/saved-configs.css`
- `css/modules/privacy-modal.css`
- `css/modules/print.css`
- `css/modules/mobile.css`

Note: `css/styles.css` now just imports `tailwind-custom.css` for backwards compatibility.
