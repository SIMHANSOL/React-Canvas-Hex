import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import reactSWC from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths(), reactSWC()],
  server: {
    port: 3000,
  },
});
