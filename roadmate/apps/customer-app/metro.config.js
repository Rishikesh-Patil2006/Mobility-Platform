const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Helper to resolve single instance of critical packages
function resolvePackage(pkgName) {
  const localPath = path.resolve(projectRoot, 'node_modules', pkgName);
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  const rootPath = path.resolve(workspaceRoot, 'node_modules', pkgName);
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  return localPath;
}

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve react and react-dom to single instances
config.resolver.extraNodeModules = new Proxy(
  {
    react: resolvePackage('react'),
    'react-dom': resolvePackage('react-dom'),
    'react-native': resolvePackage('react-native'),
    'react-native-web': resolvePackage('react-native-web'),
    '@react-navigation/native': resolvePackage('@react-navigation/native'),
    '@react-navigation/native-stack': resolvePackage('@react-navigation/native-stack'),
  },
  {
    get: (target, name) => {
      if (name in target) {
        return target[name];
      }
      return resolvePackage(name);
    },
  }
);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      if (req.url.includes('platform=web') && req.url.includes('transform.engine=hermes')) {
        req.url = req.url.replace('&transform.engine=hermes', '');
      }
      return middleware(req, res, next);
    };
  },
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules', 'react', 'index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react/jsx-runtime') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules', 'react', 'jsx-runtime.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react/jsx-dev-runtime') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules', 'react', 'jsx-dev-runtime.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-dom') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules', 'react-dom', 'index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-dom/client') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules', 'react-dom', 'client.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

