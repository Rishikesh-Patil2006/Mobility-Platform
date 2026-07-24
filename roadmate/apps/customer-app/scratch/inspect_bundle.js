const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(__dirname, '../dist/_expo/static/js/web/index-d02d221b27877d7fd159ae2841658376.js');
if (!fs.existsSync(bundlePath)) {
  console.log('Bundle not found at', bundlePath);
  process.exit(1);
}

const content = fs.readFileSync(bundlePath, 'utf8');

// Find all occurrences of react version strings
const reactVerRegex = /version\s*:\s*["']([^"']+)["']/g;
let match;
console.log('React version matches inside bundle:');
while ((match = reactVerRegex.exec(content)) !== null) {
  // Print matching context
  const start = Math.max(0, match.index - 50);
  const end = Math.min(content.length, match.index + match[0].length + 50);
  console.log(`- Version: ${match[1]} | Context: ${content.substring(start, end).replace(/\s+/g, ' ')}`);
}

// Check if react-navigation or react-native-web is loaded
console.log('Bundle length:', content.length, 'bytes');
