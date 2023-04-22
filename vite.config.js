// vite.config.js
/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";

import { viteResctrectedVariable } from "./dist";

export default defineConfig({
  // ...
  //
  plugins: [
    viteResctrectedVariable({
      restricted: {
        type: "array",
        values: ["html"],
      },
    }),
  ],
});
