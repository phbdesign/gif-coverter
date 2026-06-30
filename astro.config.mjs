import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { createRequire } from "node:module";
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);

// Copia os arquivos do ffmpeg.wasm (instalados via npm) para /public/ffmpeg
// durante o build. Assim o app serve o motor de conversão pela MESMA ORIGEM,
// evitando o bloqueio de scripts externos (CSP) do Webflow Cloud — e você não
// precisa subir o arquivo .wasm de ~30 MB para o GitHub.
function copyFfmpegAssets() {
  return {
    name: "copy-ffmpeg-assets",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        const rootDir = fileURLToPath(config.root);
        const outDir = resolve(rootDir, "public", "ffmpeg");
        mkdirSync(outDir, { recursive: true });

        const pkgDir = (name) => {
          try {
            return dirname(require.resolve(name + "/package.json"));
          } catch (e) {
            return resolve(rootDir, "node_modules", ...name.split("/"));
          }
        };

        const ffmpegUmd = resolve(pkgDir("@ffmpeg/ffmpeg"), "dist", "umd");
        const coreUmd = resolve(pkgDir("@ffmpeg/core"), "dist", "umd");

        // ffmpeg.js + o(s) chunk(s) do worker (ex.: 814.ffmpeg.js)
        for (const f of readdirSync(ffmpegUmd)) {
          if (f === "ffmpeg.js" || /^\d+\.ffmpeg\.js$/.test(f)) {
            cpSync(resolve(ffmpegUmd, f), resolve(outDir, f));
          }
        }
        // core + wasm
        cpSync(resolve(coreUmd, "ffmpeg-core.js"), resolve(outDir, "ffmpeg-core.js"));
        cpSync(resolve(coreUmd, "ffmpeg-core.wasm"), resolve(outDir, "ffmpeg-core.wasm"));

        logger.info("ffmpeg.wasm copiado para public/ffmpeg/");
      },
    },
  };
}

// Configuração para deploy no Webflow Cloud (Edge runtime / Cloudflare).
// App "standalone" (domínio próprio) → mount path "/".
// Se publicar dentro de um site existente (ex.: "/gif"), troque a base abaixo.
export default defineConfig({
  base: "/",
  output: "server",
  integrations: [copyFfmpegAssets()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
