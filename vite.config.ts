import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html", // Output location
      open: true, // Auto-open after build
      gzipSize: true, // Show gzip-compressed size
      brotliSize: true, // Show brotli-compressed size
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("chart.js")) return "charts";
            if (id.includes("react-query")) return "rq-vendor";
            return "vendor";
          }
          if (id.includes("src/components/")) {
            const match = id.match(/src\/components\/([^/]+)\//);
            if (match) {
              return `component-${match[1]}`;
            }
          }
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
    port: 5173,
  },
  assetsInclude: ["**/*.md"],
});
