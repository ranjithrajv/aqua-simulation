#!/usr/bin/env node

/**
 * Build script to copy necessary files to docs directory for GitHub Pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

// Define source and destination directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, 'app', 'public');
const destDir = path.join(__dirname, 'docs');

async function buildDocs() {
  try {
    // Create docs directory if it doesn't exist
    await fse.ensureDir(destDir);

    // Remove existing content in docs
    await fse.emptyDir(destDir);

    // Copy all files from app/public to docs
    await fse.copy(sourceDir, destDir);

    // Also copy the data directory to docs
    const sourceDataDir = path.join(__dirname, 'app', 'data');
    const destDataDir = path.join(destDir, 'data');
    if (await fse.pathExists(sourceDataDir)) {
      await fse.copy(sourceDataDir, destDataDir);
    }

    // Copy CSS directory from app root
    const sourceCssDir = path.join(__dirname, 'app', 'css');
    const destCssDir = path.join(destDir, 'css');
    if (await fse.pathExists(sourceCssDir)) {
      await fse.copy(sourceCssDir, destCssDir);
    }

    // Also copy styles directory if it exists
    const sourceStylesDir = path.join(__dirname, 'app', 'styles');
    const destStylesDir = path.join(destDir, 'styles');
    if (await fse.pathExists(sourceStylesDir)) {
      await fse.copy(sourceStylesDir, destStylesDir);
    }

    // Copy JS directory if it exists in app
    const sourceJsDir = path.join(__dirname, 'app', 'js');
    const destJsDir = path.join(destDir, 'js');
    if (await fse.pathExists(sourceJsDir)) {
      await fse.copy(sourceJsDir, destJsDir);
    }

    // Copy src directory for module imports
    const sourceSrcDir = path.join(__dirname, 'app', 'src');
    const destSrcDir = path.join(destDir, 'src');
    if (await fse.pathExists(sourceSrcDir)) {
      await fse.copy(sourceSrcDir, destSrcDir);
    }

    // Update index.html to work with GitHub Pages subdirectory and fix missing CSS reference
    const indexPath = path.join(destDir, 'index.html');
    if (await fse.pathExists(indexPath)) {
      let indexContent = await fse.readFile(indexPath, 'utf8');

      // Add base tag to ensure proper relative path resolution on GitHub Pages
      if (!indexContent.includes('<base href="./">')) {
        indexContent = indexContent.replace(
          /<head>/i,
          '<head>\n    <base href="./">'
        );
      }

      // Fix the missing CSS reference - change to reference existing styles.css
      // If css/tailwind-custom.css doesn't exist, replace with existing CSS file
      if (indexContent.includes('href="css/tailwind-custom.css"')) {
        // Check if we have styles.css in the CSS directory
        const stylesCssPath = path.join(destDir, 'css', 'styles.css');
        if (await fse.pathExists(stylesCssPath)) {
          indexContent = indexContent.replace(
            'href="css/tailwind-custom.css"',
            'href="css/styles.css"'
          );
        } else {
          // If no specific CSS file found, we'll have to use Tailwind CDN which is already loaded
          // Or remove the link tag if we have other CSS options
          const cssDirContents = await fse.readdir(path.join(destDir, 'css')).catch(() => []);
          if (cssDirContents.length > 0) {
            // Use the first available CSS file
            const firstCssFile = cssDirContents.find(file => file.endsWith('.css'));
            if (firstCssFile) {
              indexContent = indexContent.replace(
                'href="css/tailwind-custom.css"',
                `href="css/${firstCssFile}"`
              );
            }
          }
        }
      }

      await fse.writeFile(indexPath, indexContent);
    }

    // Fix the styles.css file to remove invalid imports and consolidate CSS
    const stylesCssPath = path.join(destDir, 'css', 'styles.css');
    if (await fse.pathExists(stylesCssPath)) {
      let cssContent = await fse.readFile(stylesCssPath, 'utf8');

      // Remove any import statements that reference non-existent CSS files
      cssContent = cssContent.replace(/@import\s+url\(['"]\.\/tailwind-custom\.css['"]\);?\s*\n?/g, '');
      cssContent = cssContent.replace(/@import\s+url\(['"]\.\/[^'"]*tailwind[^'"]*\.css['"]\);?\s*\n?/g, '');

      // Read and append all CSS files from modules-backup to ensure styles are included
      const modulesBackupDir = path.join(destDir, 'css', 'modules-backup');
      if (await fse.pathExists(modulesBackupDir)) {
        const cssFiles = await fse.readdir(modulesBackupDir);
        for (const file of cssFiles) {
          if (file.endsWith('.css')) {
            const filePath = path.join(modulesBackupDir, file);
            const fileContent = await fse.readFile(filePath, 'utf8');
            cssContent += '\n' + fileContent;
          }
        }
      }

      await fse.writeFile(stylesCssPath, cssContent);
    }

    console.log('✅ Successfully built docs for GitHub Pages!');
    console.log(`📁 Files copied from ${sourceDir} to ${destDir}`);
    console.log('🔧 Fixed relative paths for GitHub Pages subdirectory deployment');
  } catch (error) {
    console.error('❌ Error building docs:', error.message);
    process.exit(1);
  }
}

// Run the build function
buildDocs();