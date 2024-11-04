/* eslint-disable no-undef */
import { resolve } from "path";
import { defineConfig } from "vite";

// vite.config.js
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "minIM",
      fileName: "index",
    },
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});