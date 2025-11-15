#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fullPath;
}

function validateSections(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const requiredSections = ['hero', 'about', 'projects', 'architecture', 'tech-radar', 'contact'];
  const errors = [];

  requiredSections.forEach(section => {
    if (!html.includes(`id="${section}"`)) {
      errors.push(`Missing section: ${section}`);
    }
  });

  return errors;
}

function runTests() {
  console.log('\nRunning validation tests...\n');

  try {
    const htmlPath = checkFileExists('index.html');
    checkFileExists('styles.css');

    const errors = validateSections(htmlPath);

    if (errors.length > 0) {
      console.log('FAILED:');
      errors.forEach(err => console.log(`  - ${err}`));
      console.log('');
      process.exit(1);
    }

    console.log('PASSED: All sections present\n');
    process.exit(0);

  } catch (error) {
    console.log(`ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

runTests();
