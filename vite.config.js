import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({ autoImport: true }),
  ],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/health": "http://localhost:3008",
      "/analyze-template": "http://localhost:3008",
      "/generate-documents": "http://localhost:3008",
      "/download": "http://localhost:3008",
      "/batches": "http://localhost:3008",
      "/view": "http://localhost:3008",
    },
  },
});
