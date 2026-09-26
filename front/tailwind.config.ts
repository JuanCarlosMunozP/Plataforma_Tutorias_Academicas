import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0f6b5c",
                    hover: "#0a564c",
                    active: "#083f38",
                },
                danger: "#9b3d3b",
                secondary: "#1c2420",
                app: "#f7f8f6",
                "app-dark": "#101614",
                "app-muted": "#eff1ee",
                "app-muted-dark": "#0c1210",
                surface: "#ffffff",
                "surface-dark": "#17211e",
                border: "#e3e6e1",
                "border-dark": "#2a3833",
                text: "#1c2420",
                "text-dark": "#f3f6f4",
                "text-muted": "#5e6b66",
                "text-muted-dark": "#a3b0ab",
            },
        },
    },
    plugins: [],
};

export default config;
