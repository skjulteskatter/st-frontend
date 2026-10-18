import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// eslint-disable-next-line no-undef
const path = require("path");

export default defineConfig({
    plugins: [vueDevTools(), vue()],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Vite 4 only supports Sass' legacy JS API; Vite 5.4+ can switch to the modern one
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
    server: {
        port: 8080,
    },
    preview: {
        port: 8080,
    },
});
