const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("cjs", "mjs");
config.resolver.assetExts.push("glb", "gltf");

module.exports = withNativeWind(config, { input: "./global.css" });
