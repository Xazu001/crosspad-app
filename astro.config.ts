import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: 'directory',
    routes: {
      strategy: 'include',
      include: '/authors/*',
      exclude: ['/*.wav', '/*.json', '/*.svg', '/*.png'] // handled by static page: pages/users/faq.astro
    },
  }),
  integrations: [react()],
});