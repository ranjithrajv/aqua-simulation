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

    // Copy CSS directory if it exists in app
    const sourceCssDir = path.join(__dirname, 'app', 'css');
    const destCssDir = path.join(destDir, 'css');
    if (await fse.pathExists(sourceCssDir)) {
      await fse.copy(sourceCssDir, destCssDir);
    }

    // Copy JS directory if it exists in app
    const sourceJsDir = path.join(__dirname, 'app', 'js');
    const destJsDir = path.join(destDir, 'js');
    if (await fse.pathExists(sourceJsDir)) {
      await fse.copy(sourceJsDir, destJsDir);
    }

    console.log('✅ Successfully built docs for GitHub Pages!');
    console.log(`📁 Files copied from ${sourceDir} to ${destDir}`);
  } catch (error) {
    console.error('❌ Error building docs:', error.message);
    process.exit(1);
  }
}

// Run the build function
buildDocs();