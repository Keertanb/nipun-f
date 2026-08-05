import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET =
  process.env.VITE_API_URL || "https://earlobe-lard-amendment.ngrok-free.dev";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
