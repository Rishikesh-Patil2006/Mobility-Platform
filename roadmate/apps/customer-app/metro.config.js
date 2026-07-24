const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Allow hierarchical lookup
config.resolver.disableHierarchicalLookup = false;

// Resolve node modules
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (typeof name !== 'string') {
        return undefined;
      }
      try {
        return path.resolve(projectRoot, 'node_modules', name);
      } catch {
        return path.resolve(workspaceRoot, 'node_modules', name);
      }
    },
  }
);

// Custom resolver to force react and react-dom to resolve to customer-app/node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react' ||
    moduleName.startsWith('react/') ||
    moduleName === 'react-dom' ||
    moduleName.startsWith('react-dom/')
  ) {
    try {
      const resolvedPath = require.resolve(moduleName, { paths: [projectRoot] });
      return {
        filePath: resolvedPath,
        type: 'sourceFile',
      };
    } catch (e) {
      // Fallback
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Web middleware fix
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (
        req.url.includes('platform=web') &&
        req.url.includes('transform.engine=hermes')
      ) {
        req.url = req.url.replace('&transform.engine=hermes', '');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;