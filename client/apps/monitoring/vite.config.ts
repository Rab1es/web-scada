import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

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
      },
      shared: ["react", "react-dom", "antd"],
    }),
  ],
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
