const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  transformer: {
    // Support for SVG files
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
