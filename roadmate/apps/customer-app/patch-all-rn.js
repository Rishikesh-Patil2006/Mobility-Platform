const fs = require('fs');
const path = require('path');

const rnDir = path.join(__dirname, 'node_modules', 'react-native');

if (!fs.existsSync(rnDir)) {
  console.log("react-native directory not found, skipping patch.");
  process.exit(0);
}

let patchedCount = 0;

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 1. Replace this.#prop -> this._prop
  content = content.replace(/this\.#([a-zA-Z0-9_]+)/g, 'this._$1');
  
  // 2. Replace class field and method declarations at line starts:
  // e.g., "  #listeners: Map" -> "  _listeners: Map"
  // e.g., "  #ensureUpdateSubscriptionExists():" -> "  _ensureUpdateSubscriptionExists():"
  content = content.replace(/^(\s*)#([a-zA-Z0-9_]+)/gm, '$1_$2');
  
  // 3. Replace optional chaining and call/property accesses:
  content = content.replace(/#([a-zA-Z0-9_]+)\?\./g, '_$1?.');
  content = content.replace(/#([a-zA-Z0-9_]+)\(/g, '_$1(');
  content = content.replace(/#([a-zA-Z0-9_]+)\./g, '_$1.');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    patchedCount++;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'android' || file === 'sdks' || file === 'React' || file === 'ReactAndroid' || file === 'ReactCommon') {
      continue;
    }
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      patchFile(fullPath);
    }
  }
}

processDirectory(rnDir);
console.log(`[postinstall] Successfully patched ${patchedCount} react-native JS files.`);
