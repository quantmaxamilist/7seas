import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Old WordPress URLs → new routes (meta-refresh stubs). The wp-sitemap*.xml 301s live in vercel.json and public/_redirects only.
const oldUrls = {
  '/feed': '/',
  '/comments/feed': '/',
  '/author/admin': '/',
};

export default defineConfig({
  site: 'https://7seasbuilders.co.uk',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects: oldUrls,
  integrations: [sitemap({ filter: (p) => !p.includes('/404') })],
  server: { port: 4340 },
});
