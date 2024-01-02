import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    functionPerRoute: true,
    routes: {
      strategy: "exclude",
      exclude: ["/*.wav", "/*.json", "/*.svg", "/*.png"],
    }
  }),
  integrations: [react()],
});