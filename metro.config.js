const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");


/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};
const mainConfig = mergeConfig(config);

 
async function createConfig() {
  const nativeWindConfig = withNativeWind(mainConfig, {
    input: './global.css',
  });
  nativeWindConfig.resetCache = true;
  return nativeWindConfig;
}
module.exports = createConfig();
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
