import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "monitoring",
      filename: "remoteEntry.js",
      exposes: {
        "./SensorPanel": "./src/components/sensor-panel/index.ts",
        "./Dashboard": "./src/pages/dashboard/index.ts",
        "./UpsInfo": "./src/pages/ups-info/index.ts",
        "./Analytics": "./src/pages/analytics/index.ts",
        "./EventLogs": "./src/pages/event-logs/index.ts",
      },
      shared: ["react", "react-dom", "antd", "recharts"],
    }),
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  server: {
    port: 5001,
    strictPort: true,
  },
  preview: {
    port: 5001,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
