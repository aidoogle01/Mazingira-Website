import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.mazingirasafari.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  image: { responsiveStyles: false },
});
