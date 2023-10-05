// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('db');

const config = {
    ...defaultConfig,
    // Add any other configuration options you need here
  };
  
module.exports = config;
