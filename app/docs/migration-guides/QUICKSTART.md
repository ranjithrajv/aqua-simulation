# Quick Start: Begin Vite Migration

## Step 1: Create Feature Branch

```bash
cd /home/ranjithraj/projects/aquarium/aqua-simulation/app
git checkout -b vite-migration
```

## Step 2: Initialize npm & Install Dependencies

```bash
npm init -y

# Install Vite and plugins
npm install -D vite @vitejs/plugin-basic-ssl

# Install Vitest for testing
npm install -D vitest @vitest/ui jsdom

# Install runtime dependencies (replace CDN)
npm install lodash

# Optional: Install SweetAlert2 for better modals
npm install sweetalert2
```

## Step 3: Create Package.json Scripts

Your `package.json` should have these scripts:

```json
{
  "name": "aquarium-simulator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  },
  "devDependencies": {
    "@vitejs/plugin-basic-ssl": "^1.1.0",
    "@vitest/ui": "^1.2.2",
    "jsdom": "^24.0.0",
    "vite": "^5.1.0",
    "vitest": "^1.2.2"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

## Step 4: Create Vite Configuration

Create `vite.config.js`:

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

## Step 5: Create Directory Structure

```bash
# Create all directories
mkdir -p src/{core,domain/{calculations,recommendations,strategies},ui/{components,visualizations/charts,tank-preview,utils},services,config,utils}
mkdir -p public/data
mkdir -p styles/{components,themes}
mkdir -p tests/{unit/{calculations,domain,utils},integration}
mkdir -p docs/migration-guides
mkdir -p scripts

# Move existing documentation
mv *.md docs/migration-guides/ 2>/dev/null || true

# Move data files (already in public/data)
# No action needed if already there
```

## Step 6: Move index.html to public/

```bash
mv index.html public/
```

## Step 7: Update index.html for Vite

Replace CDN scripts with npm imports in `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aquarium Tank Simulator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#667eea',
              'primary-dark': '#5a67d8',
              'primary-light': '#8b9cf7',
              success: '#27ae60',
              'success-light': '#4CAF50',
              warning: '#f39c12',
              error: '#e74c3c',
            },
          },
        },
      };
    </script>
    <link rel="stylesheet" href="../styles/main.css" />
  </head>
  <body class="font-sans leading-relaxed text-gray-800 bg-gray-50 p-5">
    <!-- Your existing HTML content here -->

    <!-- Replace CDN scripts with module script -->
    <script type="module" src="../src/main.js"></script>
  </body>
</html>
```

## Step 8: Create Entry Point

Create `src/main.js`:

```javascript
import './styles/main.css';
import { AquariumApp } from './core/AquariumApp.js';

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AquariumApp();
});
```

## Step 9: Start Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Step 10: Verify Everything Works

Open the browser and verify:

- [ ] Page loads without errors
- [ ] All dimensions inputs work
- [ ] Volume calculations work
- [ ] Saved configurations load
- [ ] Export/import works

## Next Steps After Setup

1. **Move files to new structure** (see MIGRATION_PLAN.md Phase 2)
2. **Extract components one at a time** (see MIGRATION_PLAN.md Phase 3)
3. **Add tests** (see MIGRATION_PLAN.md Phase 4)
4. **Build production bundle**:
   ```bash
   npm run build
   ```

## Troubleshooting

### "Cannot find module" errors

- Check that file paths in imports are correct
- Verify files were moved to new locations
- Update import paths in moved files

### Build fails with CSS errors

- Check that CSS file path in index.html is correct: `../styles/main.css`
- Verify styles directory exists

### Tailwind styles not loading

- Make sure Tailwind CDN is still in index.html
- For production: Install Tailwind via npm and configure PostCSS

### Port 5173 already in use

- Change port in vite.config.js:
  ```javascript
  server: {
    port: 3000, // or another available port
  }
  ```

---

## When to Commit

After completing each step:

1. `git add .`
2. `git commit -m "feat: initialize Vite project"`
3. Continue to next step

This makes it easy to rollback if needed.
