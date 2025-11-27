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
  const requiredSections = ['hero', 'about', 'projects', 'tech-radar', 'contact'];
  const errors = [];

  requiredSections.forEach(section => {
    if (!html.includes(`id="${section}"`)) {
      errors.push(`Missing section: ${section}`);
    }
  });

  return errors;
}

function validateModals(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const errors = [];

  // Check for modal structure
  if (!html.includes('class="arch-modal"')) {
    errors.push('Missing architecture modal structure');
  }

  // Check for modal trigger buttons
  if (!html.includes('data-modal="sqs-architecture-modal"')) {
    errors.push('Missing SQS architecture modal trigger button');
  }

  // Check for modal close button
  if (!html.includes('class="arch-modal__close"')) {
    errors.push('Missing modal close button');
  }

  // Check for Mermaid diagram container
  if (!html.includes('id="sqs-architecture-diagram"')) {
    errors.push('Missing SQS architecture diagram container');
  }

  return errors;
}

function runTests() {
  console.log('\nRunning validation tests...\n');

  try {
    const htmlPath = checkFileExists('index.html');
    checkFileExists('styles.css');
    checkFileExists('modals.js');

    const sectionErrors = validateSections(htmlPath);
    const modalErrors = validateModals(htmlPath);
    const allErrors = [...sectionErrors, ...modalErrors];

    if (allErrors.length > 0) {
      console.log('FAILED:');
      allErrors.forEach(err => console.log(`  - ${err}`));
      console.log('');
      process.exit(1);
    }

    console.log('✓ All sections present');
    console.log('✓ Modal structure validated');
    console.log('✓ Modal triggers configured');
    console.log('\nPASSED: All validation tests passed\n');
    process.exit(0);

  } catch (error) {
    console.log(`ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

runTests();
