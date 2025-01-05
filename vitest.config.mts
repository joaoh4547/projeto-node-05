import swc from "unplugin-swc";
import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    test: {
        globals: true,
        root: "./",
        exclude: [...configDefaults.exclude, "**/data/**"],
    },
    plugins: [
        tsconfigPaths(),
        swc.vite({
            module: { type: "es6" },
        }),
    ],
});
