#!/bin/bash

# Vite Migration Setup Script
# Run this script to begin the migration process

echo "🚀 Starting Vite Migration Setup..."
echo ""

# Check if running from correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the app directory"
    exit 1
fi

# Step 1: Create git branch
echo "📦 Step 1: Creating feature branch..."
git checkout -b vite-migration 2>/dev/null || {
    echo "ℹ️  Branch vite-migration already exists or could not be created"
    echo "   You may already be on this branch or there was a conflict"
}
echo ""

# Step 2: Install dependencies
echo "📥 Step 2: Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "❌ Error: package.json not found"
    exit 1
fi
echo ""

# Step 3: Create directory structure
echo "📁 Step 3: Creating directory structure..."
mkdir -p src/{core,domain/{calculations,recommendations,strategies},ui/{components,visualizations/charts,tank-preview,utils},services,config,utils}
mkdir -p public/data
mkdir -p styles/{components,themes}
mkdir -p tests/{unit/{calculations,domain,utils},integration}
mkdir -p docs/migration-guides
mkdir -p scripts
echo "✅ Directory structure created"
echo ""

# Step 4: Move index.html to public
echo "📄 Step 4: Moving index.html to public/..."
if [ -f "index.html" ]; then
    mv index.html public/
    echo "✅ index.html moved to public/"
else
    echo "⚠️  index.html not found, skipping"
fi
echo ""

# Step 5: Move documentation
echo "📚 Step 5: Moving documentation files..."
for file in *.md; do
    if [ -f "$file" ] && [ "$file" != "MIGRATION_README.md" ]; then
        mv "$file" docs/migration-guides/ 2>/dev/null || true
    fi
done
echo "✅ Documentation files moved"
echo ""

# Step 6: Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "✅ .gitignore already exists"
fi
echo ""

# Done
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update public/index.html with Vite entry point (see QUICKSTART.md)"
echo "  2. Run: npm run dev"
echo "  3. Verify app works at http://localhost:5173"
echo "  4. Follow MIGRATION_PLAN.md for remaining steps"
echo ""
echo "📖 Read MIGRATION_PLAN.md for detailed migration instructions"
echo "📖 Read QUICKSTART.md for quick setup guide"
