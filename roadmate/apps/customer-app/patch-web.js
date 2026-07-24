const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.log('dist/index.html not found, skipping patch.');
  process.exit(0);
}

let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const requirePolyfill = `
<script>
window.require = function(moduleName) {
  if (moduleName === '@babel/runtime/helpers/defineProperty') {
    return function(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    };
  }
  if (moduleName === '@babel/runtime/helpers/interopRequireDefault') {
    return function(obj) { return obj && obj.__esModule ? obj : { default: obj }; };
  }
  if (moduleName === '@babel/runtime/helpers/interopRequireWildcard') {
    return function(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) { return obj; }
      if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) { return { default: obj }; }
      var cache = null; // simplified
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); }
          else { newObj[key] = obj[key]; }
        }
      }
      newObj.default = obj;
      return newObj;
    };
  }
  console.warn('Unhandled require in browser polyfill:', moduleName);
  return null;
};
</script>
`;

if (!indexHtml.includes('window.require = function')) {
  // Try to inject before </head> (case‑insensitive)
  const headCloseRegex = /<\/head\s*>/i;
  if (headCloseRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(headCloseRegex, requirePolyfill + '</head>');
    console.log('Injected require polyfill before </head>');
  } else {
    // Fallback: inject before the first <script> tag
    const firstScript = /<script[^>]*>/i;
    if (firstScript.test(indexHtml)) {
      indexHtml = indexHtml.replace(firstScript, requirePolyfill + firstScript.source);
      console.log('Injected require polyfill before first <script>');
    } else {
      // As a last resort, prepend to the file
      indexHtml = requirePolyfill + indexHtml;
      console.log('Injected require polyfill at start of file');
    }
  }
  fs.writeFileSync(indexHtmlPath, indexHtml);
}
