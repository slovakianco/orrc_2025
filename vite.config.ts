import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load optional Replit plugins gracefully
async function loadOptionalPlugins() {
  const plugins = [];
  try {
    const themePlugin = await import("@replit/vite-plugin-shadcn-theme-json");
    plugins.push(themePlugin.default());
  } catch {
    // Theme plugin not available, skipping
  }
  try {
    const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch {
    // Runtime error overlay not available, skipping
  }
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer());
    } catch {
      // Cartographer not available, skipping
    }
  }
  return plugins;
}

const optionalPlugins = await loadOptionalPlugins();

export default defineConfig({
  plugins: [
    react(),
    ...optionalPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
