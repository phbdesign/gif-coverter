import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// Configuração para deploy no Webflow Cloud (Edge runtime / Cloudflare).
// Para um app "standalone" (domínio próprio na raiz), o mount path é "/".
// Se você publicar dentro de um site existente, num caminho como "/gif",
// troque a base abaixo para "/gif".
export default defineConfig({
  base: "/",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
