// vite.config.js
/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";

import customPlugin from "./src/plugin";

export default defineConfig({
  // ...
  //
  plugins: [customPlugin()],
});
