import type { MetroConfig } from "expo/metro-config";

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config: MetroConfig = getDefaultConfig(process.cwd());

module.exports = withNativeWind(config, { input: "./global.css" });
