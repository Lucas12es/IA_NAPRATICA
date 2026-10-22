# IA na Prática — Landing Page de vendas

Landing page do ebook **"IA na Prática: Do Primeiro Prompt às Automações que Trabalham por Você"**, de Lucas Taborda.
Projeto **LDT Negócios & Soluções**, desenvolvido segundo o Framework LDT v1.0.

- **Tipo:** Landing Page (1 página comercial) + 2 páginas legais (Política de Privacidade e Termos de Uso).
- **Stack:** HTML, CSS e JavaScript estáticos, sem dependências e sem etapa de build.
  Exceção documentada à stack padrão (Next.js): o ambiente de desenvolvimento não tinha acesso ao npm; a landing
  não precisa de backend nem formulários. Ver `docs/LDT-01-escopo-estrategia-design.md`.
- **Hospedagem:** qualquer host estático (Cloudflare Pages recomendado, GitHub Pages, Netlify, etc.).

## Estrutura

```
index.html                       Página principal (SEO, Open Graph, JSON-LD Book + FAQPage)
politica-de-privacidade/         Página legal
termos-de-uso/                   Página legal
404.html · robots.txt · sitemap.xml · _headers
assets/css/styles.css            Design system (tokens em :root) + componentes
assets/js/config.js              ÚNICO arquivo de configuração (checkout, preço, Google Analytics)
assets/js/main.js                Interações (reveal, carrossel, copiar prompt, barra fixa, cookies/GA)
assets/img · assets/fonts        Imagens WebP, OG e fontes locais (Inter, subset latin)
scripts/set-domain.mjs           Troca o domínio provisório em canonical/OG/sitemap/robots
docs/                            Escopo, pesquisa, benchmark, estratégia, UX/UI e design system
```

## Rodar localmente

Requisitos: nenhum além de um servidor estático. Exemplos:

```bash
python3 -m http.server 8000        # ou
npx serve .
```
Abra http://localhost:8000. Não há `npm install` nem `npm run build` neste projeto.

## O que PRECISA ser preenchido antes de publicar

1. **Link de compra:** `assets/js/config.js` → `checkoutUrl`. Enquanto estiver vazio, o botão da oferta exibe
   "Link de compra em breve" (por design, nenhum botão fica sem ação).
2. **Preço (opcional):** `config.js` → `price` (ex.: `"R$ 47,00"`). Vazio = preço oculto.
3. **Domínio:** `node scripts/set-domain.mjs https://www.seudominio.com.br` (canonical, Open Graph, JSON-LD, sitemap, robots).
4. **Páginas legais:** substituir os campos amarelos `[CPF/CNPJ]`, `[E-MAIL DE CONTATO]`, `[DATA DE PUBLICAÇÃO]` e **revisar os textos com um advogado**.
   Eles descrevem apenas as práticas reais desta página (sem formulários; Google Analytics só com consentimento, se ativado).
5. **Garantia:** a página cita o direito de arrependimento de 7 dias do CDC (art. 49). Confirme com a política da plataforma de checkout.

## Opcional

- **Google Analytics 4:** `config.js` → `gaId: "G-XXXXXXXXXX"`. Ao preencher, aparece automaticamente um aviso de
  cookies e o GA só é carregado após o "Aceitar". Depois, associe a propriedade ao Google Search Console
  (envie `https://seudominio/sitemap.xml`). Meta Pixel não foi incluído (não solicitado).
- **Depoimentos reais:** nenhum foi inventado. Quando houver, crie uma seção de prova social antes da oferta.
- **Fonte de marca (Sora):** o ebook usa Sora nos títulos. Neste ambiente ela não estava disponível, então os
  títulos usam Inter Display ExtraBold. Para trocar: adicione `assets/fonts/sora-800.woff2`, declare o `@font-face`
  em `styles.css` e altere `--font-display`.

## Deploy (Cloudflare Pages)

1. Suba esta pasta para um repositório no GitHub (o `.gitignore` já está configurado).
2. Cloudflare Pages → *Create project* → conecte o repositório.
3. **Build command:** vazio · **Build output directory:** `/` (raiz).
4. Configure o domínio personalizado e rode `set-domain.mjs` antes do commit final.
O arquivo `_headers` aplica cabeçalhos de segurança e cache de longa duração em `/assets/*`.

## Qualidade verificada (ambiente de desenvolvimento)

Medido com Chromium/Playwright (Lighthouse não pôde ser instalado por bloqueio do npm):
- Desktop 1440 px e mobile 390 px sem rolagem horizontal e sem erros de console.
- Mobile com CPU 4× mais lenta + rede 4G simulada: LCP ≈ 1,1 s, CLS 0, ~186 KB transferidos no carregamento inicial.
- Copiar prompt, FAQ, carrossel e barra fixa de CTA testados.
**Pendente:** rodar Lighthouse/PageSpeed Insights na URL publicada e conferir as metas LDT (Perf > 95, SEO/A11y/Best Practices 100).
