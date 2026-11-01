# Mente Ativa 55+ — Página de vendas

## Estrutura
```
mente-ativa-55/
├── index.html            ← conteúdo da página (seções comentadas)
├── assets/
│   ├── css/style.css     ← estilos (variáveis de cor/fonte no topo)
│   ├── js/main.js        ← interações (CONFIG no topo)
│   ├── img/              ← imagens extraídas do vídeo (.webp)
│   └── video/vsl.mp4     ← vídeo de vendas comprimido (~10 MB)
```

## Antes de publicar
1. **Link do checkout** — em `assets/js/main.js`, preencha:
   ```js
   checkoutUrl: "https://pay.hotmart.com/SEU-CODIGO",
   ```
   UTMs da URL (utm_source, fbclid, sck etc.) são repassadas automaticamente para o checkout.
2. **Comportamento dos botões** — `directCheckout: false` faz os botões rolarem até a oferta
   e só o botão da caixa de oferta abre o checkout. Mude para `true` para mandar todos direto ao checkout.
3. **Pixel** — cole o código do Pixel da Meta / Google Tag no `<head>`. O evento
   `InitiateCheckout` / `begin_checkout` já dispara no clique do checkout.

## Ajustes rápidos
- Cores: `:root` no começo do `style.css` (`--navy`, `--gold`, `--cta`…)
- Fontes: Fraunces (títulos) + Atkinson Hyperlegible (texto, feita para leitura fácil)
- Pilares do método: array `PILLARS` no `main.js`

## Rodar no VS Code
Abra a pasta e use a extensão **Live Server** (botão "Go Live").
Para publicar: arraste a pasta na Vercel ou Netlify.
