import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import sitemap from '@astrojs/sitemap';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: 'directory',
    functionPerRoute: true,
    routes: {
      strategy: 'include',
      include: ['/authors/*', '/'],
    },
  }),
  integrations: [react(), sitemap()],
  site: 'https://crosspad.app',

});