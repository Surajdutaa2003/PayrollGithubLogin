/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTest.js",
    coverage: {
      provider: "v8", // ya "istanbul"
      reporter: ["text", "lcov"],
    },
  },
});
