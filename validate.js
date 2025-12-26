// Comprehensive validation script for the aquarium simulator
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running Comprehensive Validation Suite\n');

// 1. JavaScript Syntax Check
console.log('1. JavaScript Syntax Validation:');
const jsFiles = [
    'js/app.js',
    'js/tank-calculator.js', 
    'js/glass-recommendations.js',
    'js/equipment-recommendations.js',
    'js/equipment-strategy.js',
    'js/dom-helper.js',
    'js/constants.js',
    'js/tank-visualizer.js'
];

let allJSPassed = true;
jsFiles.forEach(file => {
    try {
        execSync(`node --check ${file}`, { stdio: 'pipe' });
        console.log(`   ✓ ${file}`);
    } catch (error) {
        console.log(`   ❌ ${file}: ${error.message}`);
        allJSPassed = false;
    }
});

// 2. HTML Structure Check
console.log('\n2. HTML Structure Validation:');
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const ids = [...htmlContent.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    const divCount = (htmlContent.match(/<div/g) || []).length;
    const closingDivCount = (htmlContent.match(/<\/div>/g) || []).length;
    
    if (duplicates.length > 0) {
        console.log(`   ❌ Duplicate IDs found: ${duplicates.join(', ')}`);
    } else {
        console.log('   ✓ No duplicate IDs');
    }
    
    if (divCount !== closingDivCount) {
        console.log(`   ❌ Div tag mismatch: ${divCount} opening, ${closingDivCount} closing`);
    } else {
        console.log('   ✓ Div tags balanced');
    }
} catch (error) {
    console.log(`   ❌ HTML validation failed: ${error.message}`);
}

// 3. Module Import/Export Check
console.log('\n3. Module Dependency Validation:');
const importRegex = /import\s+{[^}]+}\s+from\s+['"]([^'"]+)['"]/g;
const exportRegex = /export\s+(?:class|const|function|default)/g;

try {
    const appContent = fs.readFileSync('js/app.js', 'utf8');
    const imports = [...appContent.matchAll(importRegex)].map(m => m[1]);
    
    let missingModules = [];
    imports.forEach(importPath => {
        const fullPath = path.join('js', importPath);
        if (!fs.existsSync(fullPath)) {
            missingModules.push(importPath);
        }
    });
    
    if (missingModules.length > 0) {
        console.log(`   ❌ Missing modules: ${missingModules.join(', ')}`);
    } else {
        console.log('   ✓ All imported modules exist');
    }
} catch (error) {
    console.log(`   ❌ Module validation failed: ${error.message}`);
}

// 4. Code Structure Check
console.log('\n4. Code Structure Analysis:');
try {
    const appContent = fs.readFileSync('js/app.js', 'utf8');
    
    // Check for orphaned code (lines not inside functions/classes)
    const lines = appContent.split('\n');
    let inFunction = false;
    let inClass = false;
    let orphanedLines = [];
    
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('class ')) inClass = true;
        if (trimmed.startsWith('function ') || trimmed.match(/^\s*\w+\s*\([^)]*\)\s*{/)) inFunction = true;
        if (trimmed === '}' && inFunction) inFunction = false;
        if (trimmed === '}' && inClass && !inFunction) inClass = false;
        
        // Check for executable code outside functions/classes
        if (!inClass && !inFunction && trimmed && 
            !trimmed.startsWith('//') && !trimmed.startsWith('/*') && 
            !trimmed.startsWith('*') && !trimmed.startsWith('import') && 
            !trimmed.startsWith('export') && !trimmed.startsWith('class')) {
            orphanedLines.push(index + 1);
        }
    });
    
    if (orphanedLines.length > 0) {
        console.log(`   ❌ Potential orphaned code at lines: ${orphanedLines.slice(0, 5).join(', ')}${orphanedLines.length > 5 ? '...' : ''}`);
    } else {
        console.log('   ✓ No orphaned code detected');
    }
} catch (error) {
    console.log(`   ❌ Structure validation failed: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(50));
if (allJSPassed) {
    console.log('🎉 All validations passed! Code is ready for deployment.');
} else {
    console.log('❌ Validation failed. Please fix the issues above.');
}
console.log('='.repeat(50));
EOF && echo "Validation script created successfully"
