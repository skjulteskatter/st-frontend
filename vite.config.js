import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// eslint-disable-next-line no-undef
const path = require("path");

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 8080,
    },
    preview: {
        port: 8080,
    },
});
