# Vídeo → GIF para Power BI

App simples para transformar vídeos em GIFs leves, otimizados para dashboards do **Power BI**. Feito para rodar no **Webflow Cloud** (deploy a partir de um repositório GitHub).

A conversão acontece **100% no navegador** do usuário (via `ffmpeg.wasm`). Nenhum vídeo é enviado para servidores — rápido, privado e sem custo de processamento.

## Como funciona

1. O usuário arrasta 1 ou mais vídeos.
2. Escolhe um preset (Compacto, Equilibrado ou Nítido).
3. Clica em **Converter para GIF** e baixa o resultado.

### Presets (otimizados para Power BI)

| Preset | Largura | FPS | Cores | Quando usar |
|---|---|---|---|---|
| Compacto | 400 px | 10 | 64 | Menor arquivo. Tiles pequenos / GIF incorporado no relatório. |
| Equilibrado | 560 px | 12 | 128 | Recomendado para a maioria dos dashboards. |
| Nítido | 720 px | 15 | 200 | Mais definição, para visuais maiores. |

> O app nunca aumenta o vídeo: se o original for menor que a largura do preset, mantém o tamanho original.

## Tecnologia

- **Astro 5** (`output: server`) com o adaptador **Cloudflare** (Edge runtime do Webflow Cloud)
- **ffmpeg.wasm** single-thread, carregado do CDN (unpkg) em runtime e executado num **worker criado a partir de um blob de mesma origem** — roda dentro da CSP do Webflow Cloud e não exige headers `COOP/COEP`
- O arquivo `.wasm` (~30 MB) **não** vai para o repositório nem para o deploy (excederia o limite de assets do Cloudflare); ele é baixado uma única vez no navegador do usuário e fica em cache
- A interface é HTML/CSS/JS puro (sem framework de UI)

## Rodar localmente (opcional)

Requer Node.js 22+ e npm.

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:4321
npm run preview   # simula o ambiente do Webflow Cloud (build + wrangler)
```

## Deploy no Webflow Cloud

Este repositório já vem com tudo configurado (`webflow.json`, `astro.config.mjs`, `wrangler.json`).

1. Garanta que o código esteja em um repositório no GitHub.
2. No Webflow: **Dashboard → New Project → App**.
3. Conecte o GitHub e importe este repositório.
4. Escolha **New domain** (app standalone na raiz) e clique em **Deploy**.

A cada novo `git push` na branch publicada, o Webflow Cloud refaz o deploy automaticamente.

> Se você publicar dentro de um site existente (em um caminho como `/gif`),
> ajuste a `base` em `astro.config.mjs` para `"/gif"`.

## Dica de uso no Power BI

Hospede o GIF gerado (ou incorpore-o) e use o visual **Image** apontando para a URL,
ou um visual de conteúdo HTML. Quanto menor o GIF, mais rápido o dashboard carrega.
