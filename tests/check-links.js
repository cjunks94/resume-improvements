#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function extractLocalLinks(html) {
  const hrefMatches = html.match(/href="([^"]+)"/g) || [];
  return hrefMatches
    .map(match => match.match(/href="([^"]+)"/)[1])
    .filter(href => !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:'));
}

function checkLocalFiles(links, basePath) {
  const missing = [];

  links.forEach(link => {
    const filePath = path.join(basePath, link);
    if (!fs.existsSync(filePath)) {
      missing.push(link);
    }
  });

  return missing;
}

function main() {
  console.log('\nChecking local links...\n');

  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const basePath = path.join(__dirname, '..');

  const localLinks = extractLocalLinks(html);
  const missing = checkLocalFiles(localLinks, basePath);

  if (missing.length > 0) {
    console.log('FAILED: Missing files:');
    missing.forEach(file => console.log(`  - ${file}`));
    console.log('');
    process.exit(1);
  }

  console.log(`PASSED: All ${localLinks.length} local files found\n`);
  process.exit(0);
}

main();
