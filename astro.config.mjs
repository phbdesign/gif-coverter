import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// Configuração para deploy no Webflow Cloud (Edge runtime / Cloudflare).
// App "standalone" (domínio próprio na raiz) → mount path "/".
// Se publicar dentro de um site existente (ex.: "/gif"), troque a base abaixo.
export default defineConfig({
  base: "/",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
