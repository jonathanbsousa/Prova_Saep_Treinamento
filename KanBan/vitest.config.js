import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // 👈 habilita 'expect', 'test', 'describe', etc.
    environment: "jsdom",      // 👈 simula o DOM do navegador
    setupFiles: "./src/setupTests.js", // 👈 carrega extensões, como jest-dom
  },
});
