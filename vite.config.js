/* eslint-disable no-undef */
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'

// vite.config.js
export default defineConfig({
  plugins: [vue()],
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