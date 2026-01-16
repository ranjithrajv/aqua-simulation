# GitHub Pages Deployment Guide

This guide explains how to deploy the Aquarium Tank Simulator to GitHub Pages.

## Prerequisites

- A GitHub account
- A repository containing this project
- Admin access to the repository settings

## Steps to Enable GitHub Pages

### Method 1: Using the Deployment Script (Recommended)

1. **Build for GitHub Pages**:
   ```bash
   npm run build-github-pages
   ```

   This command will:
   - Build the necessary files to the root directory

2. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select "Deploy from a branch"
   - Choose your main branch (e.g., `master`)
   - Select `/ (root)` as the folder
   - Click **Save**

### Method 2: Manual Configuration

1. **Build the documentation**:
   ```bash
   npm run build-docs
   ```
   
2. **Push the docs directory**:
   - Commit and push the `/docs` directory to your main branch

3. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select "Deploy from a branch"
   - Choose your main branch (e.g., `main` or `master`)
   - Select `/docs` as the folder
   - Click **Save**

## Alternative: Moving Files to Root (One-time setup)

If you prefer to serve directly from the root of your main branch:

1. Move the contents of `/app/public` to the repository root:
   ```bash
   mv app/public/* .
   ```

2. Then configure GitHub Pages to use the main branch with `/ (root)` folder.

## Verification

Once deployed, your site will be available at:
```
https://<username>.github.io/<repository-name>/
```

For example:
```
https://octocat.github.io/aquarium-simulation/
```

## Troubleshooting

- If the site doesn't load properly, check that all relative paths in `index.html` are correct
- Ensure that the `docs` directory contains all necessary files (index.html, css/, js/, data/)
- Clear browser cache if changes don't appear immediately after deployment
- Check GitHub Actions or Pages settings if deployment fails

## Automatic Deployment

To set up automatic deployment on every push to main branch, you can add a GitHub Action workflow. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build docs
      run: npm run build-docs
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

Note: With the current setup using the `gh-pages` branch approach, the deployment script handles the publishing automatically.