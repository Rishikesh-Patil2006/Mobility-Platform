const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      projectRoot: env.projectRoot || path.resolve(__dirname),
    },
    argv
  );

  if (!config.entry || (Array.isArray(config.entry) && config.entry.length === 0) || Object.keys(config.entry).length === 0) {
    config.entry = {
      app: [path.resolve(__dirname, 'index.js')],
    };
  }

  return config;
};
