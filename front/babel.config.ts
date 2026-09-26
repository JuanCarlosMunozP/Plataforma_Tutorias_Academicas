import type { ConfigAPI, TransformOptions } from "@babel/core";

export default function babelConfig(api: ConfigAPI): TransformOptions {
    api.cache.forever();
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
    };
}
