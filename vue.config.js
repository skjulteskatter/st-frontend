const path = require("path");
const webpack = require("webpack");

const srcPath = path.resolve(__dirname, "src");

module.exports = {
    configureWebpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            "@": srcPath,
        };

        if (process.env.NODE_ENV === "test") {
            config.resolve.alias["@/services/auth"] = path.resolve(
                __dirname,
                "tests/mocks/auth.ts",
            );
            config.resolve.alias["@/services/session"] = path.resolve(
                __dirname,
                "tests/mocks/session.ts",
            );
            config.resolve.alias["@/router"] = path.resolve(
                __dirname,
                "tests/mocks/router.ts",
            );
            config.resolve.alias["@/i18n"] = path.resolve(
                __dirname,
                "tests/mocks/i18n.ts",
            );
            config.resolve.alias["firebase/firestore"] = path.resolve(
                __dirname,
                "tests/mocks/firestore.ts",
            );

            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(
                    /bandSyncService\.ts$/,
                    path.resolve(__dirname, "tests/mocks/bandSyncService.ts"),
                ),
            );
        }
    },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === "test") {
            config.plugins.delete("fork-ts-checker");
        }
    },
    pluginOptions: {
        "unit-mocha": {
            setupFiles: ["tests/setup.ts"],
        },
    },
};
