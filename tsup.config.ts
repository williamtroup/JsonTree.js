import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/jsontree.ts"],
    platform: "neutral",
    format: ["esm", "cjs"],
    outDir: "./dist",
    dts: true,
    splitting: false,
    sourcemap: false,
    minify: true,
    clean: true,
  },
]);
