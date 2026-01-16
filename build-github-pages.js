#!/usr/bin/env node

/**
 * Build script to prepare files for GitHub Pages deployment to root directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

// Define source and destination directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, 'app', 'public');
const tempDestDir = path.join(__dirname, 'temp-github-pages');

async function buildForGithubPages() {
  try {
    // Create temporary directory
    await fse.ensureDir(tempDestDir);
    await fse.emptyDir(tempDestDir);

    // Copy all files from app/public to temp directory
    await fse.copy(sourceDir, tempDestDir);

    // Copy the data directory
    const sourceDataDir = path.join(__dirname, 'app', 'data');
    const destDataDir = path.join(tempDestDir, 'data');
    if (await fse.pathExists(sourceDataDir)) {
      await fse.copy(sourceDataDir, destDataDir);
    }

    // Copy the CSS directory
    const sourceCssDir = path.join(__dirname, 'app', 'css');
    const destCssDir = path.join(tempDestDir, 'css');
    if (await fse.pathExists(sourceCssDir)) {
      await fse.copy(sourceCssDir, destCssDir);

      // Consolidate all CSS files into styles.css
      const stylesCssPath = path.join(destCssDir, 'styles.css');
      if (await fse.pathExists(stylesCssPath)) {
        let cssContent = await fse.readFile(stylesCssPath, 'utf8');

        // Remove any import statements that reference non-existent CSS files
        cssContent = cssContent.replace(
          /@import\s+url\(['"]\.\/tailwind-custom\.css['"]\);?\s*\n?/g,
          ''
        );
        cssContent = cssContent.replace(
          /@import\s+url\(['"]\.\/[^'"]*tailwind[^'"]*\.css['"]\);?\s*\n?/g,
          ''
        );

        // Read and append all CSS files from modules-backup to ensure styles are included
        const modulesBackupDir = path.join(destCssDir, 'modules-backup');
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
    }

    // Copy the JS directory and fix import paths
    const sourceJsDir = path.join(__dirname, 'app', 'js');
    const destJsDir = path.join(tempDestDir, 'js');
    if (await fse.pathExists(sourceJsDir)) {
      await fse.copy(sourceJsDir, destJsDir);

      // Fix import paths in app.js
      const appJsPath = path.join(destJsDir, 'app.js');
      if (await fse.pathExists(appJsPath)) {
        let appJsContent = await fse.readFile(appJsPath, 'utf8');
        // Replace '../src/' with './src/' for GitHub Pages deployment
        appJsContent = appJsContent.replace(/from\s+['"]\.\.\/src\//g, "from './src/");
        await fse.writeFile(appJsPath, appJsContent);
      }
    }

    // Copy the src directory for module imports and fix import paths
    const sourceSrcDir = path.join(__dirname, 'app', 'src');
    const destSrcDir = path.join(tempDestDir, 'src');
    if (await fse.pathExists(sourceSrcDir)) {
      await fse.copy(sourceSrcDir, destSrcDir);

      // Fix all import paths in src files for GitHub Pages deployment
      // When src files are served from root, their relative imports need to be updated
      const srcFiles = await fse.glob('**/*.js', { cwd: destSrcDir });
      for (const file of srcFiles) {
        const filePath = path.join(destSrcDir, file);
        let content = await fse.readFile(filePath, 'utf8');

        // Fix relative imports to work when src is at root level
        // '../utils/' -> '../../../utils/' (going up from src/domain/calculations/ to root utils/)
        // '../../utils/' -> '../../../../utils/' etc.

        // Replace three levels up
        content = content.replace(/from\s+['"]\.\.\/\.\.\/\.\.\//g, "from '../../../");
        // Replace two levels up
        content = content.replace(/from\s+['"]\.\.\/\.\.\//g, "from '../../");
        // Replace one level up
        content = content.replace(/from\s+['"]\.\.\//g, "from '../");

        await fse.writeFile(filePath, content);
      }
    }

    // Update index.html to remove base tag since we're serving from root
    const indexPath = path.join(tempDestDir, 'index.html');
    if (await fse.pathExists(indexPath)) {
      let indexContent = await fse.readFile(indexPath, 'utf8');

      // Remove the base tag since we're serving from root
      indexContent = indexContent.replace(/<base href="\.\.\/">\n?/g, '');

      // Update CSS reference if needed
      if (indexContent.includes('href="css/tailwind-custom.css"')) {
        const stylesCssPath = path.join(tempDestDir, 'css', 'styles.css');
        if (await fse.pathExists(stylesCssPath)) {
          indexContent = indexContent.replace(
            'href="css/tailwind-custom.css"',
            'href="css/styles.css"'
          );
        }
      }

      await fse.writeFile(indexPath, indexContent);
    }

    // Now copy the necessary files from temp directory to root (excluding app directory to avoid conflicts)
    const filesToCopy = ['index.html', 'css', 'data', 'js', 'src'];

    for (const fileOrDir of filesToCopy) {
      const sourcePath = path.join(tempDestDir, fileOrDir);
      const destPath = path.join(__dirname, fileOrDir);

      if (await fse.pathExists(sourcePath)) {
        // Don't overwrite the app directory since that contains source code
        if (fileOrDir !== 'app' || !(await fse.pathExists(destPath))) {
          await fse.copy(sourcePath, destPath);
        }
      }
    }

    // Clean up temporary directory
    await fse.remove(tempDestDir);

    console.log('✅ Successfully built files for GitHub Pages in root directory!');
    console.log(`📁 Files prepared in root directory for GitHub Pages`);
  } catch (error) {
    console.error('❌ Error building files for GitHub Pages:', error.message);
    process.exit(1);
  }
}

// Run the build function
buildForGithubPages();
