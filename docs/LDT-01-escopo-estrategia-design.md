# LDT · Projeto "IA na Prática" — Escopo, Estratégia e Design

Documento das etapas 1–7 da metodologia LDT (Pesquisa, Benchmark, Estratégia, UX, UI, Design System, Wireframe).
Base: Framework LDT v1.0 (Módulos 1–10 e 4) + conteúdo integral do ebook (77 páginas).

## 1. Classificação e escopo

| Item | Definição |
|---|---|
| Tipo de projeto | **Landing Page** (página principal única) |
| Objetivo comercial | Vender o ebook "IA na Prática — Do Primeiro Prompt às Automações que Trabalham por Você" (Lucas Taborda, edição 2026) |
| Conversão principal | Clique no botão de compra, direcionado ao checkout (link configurável em `assets/js/config.js`) |
| Público-alvo | Iniciantes e usuários intermediários de IA: profissionais, estudantes, criadores de conteúdo e empreendedores (perfis do Cap. 13 do ebook) |
| Páginas comerciais | 1 (`/`) |
| Páginas legais | Política de Privacidade e Termos de Uso (páginas próprias, linkadas no rodapé) |
| Funcionalidades | CTAs de compra, FAQ acessível, amostra de prompts com botão "copiar", galeria de páginas reais do ebook, barra de CTA fixa no mobile, aviso de cookies (apenas se Google Analytics for configurado) |
| Plataforma | Hospedagem estática (Cloudflare Pages / GitHub Pages / qualquer CDN) |
| Referência de design | Estilo "Canva": cores vibrantes, cantos bem arredondados, adesivos/selos, blocos em grade (bento), tipografia grande — sobre a identidade do próprio ebook |
| Template por nicho | Não solicitado pelo usuário (pasta TEMPLATES não consultada) |
| Critérios de aceitação | Responsiva sem rolagem horizontal; CTAs funcionais; SEO técnico completo; acessível por teclado; sem dados inventados; Lighthouse medido |

### Exceção documentada à stack padrão
O Framework LDT define Next.js/React/TypeScript/Tailwind como stack padrão. Neste projeto o usuário
optou por **HTML/CSS/JS estático** porque o ambiente de desenvolvimento não tinha acesso ao registro
do npm (impossível instalar dependências e validar `npm run build`). A landing não exige backend nem
formulário, então a solução estática é tecnicamente adequada e a mais leve possível. React Hook Form/Zod
não se aplicam (não há formulários).

## 2. Pesquisa

**Produto (fatos extraídos do ebook):** 77 páginas · 14 capítulos em 4 partes (Fundamentos, As ferramentas,
Poder avançado, Na prática) · +45 ferramentas · biblioteca com 10 prompts prontos · 5 automações prontas
para montar · plano de 30 dias · glossário A–Z · lista de ferramentas citadas · desafios práticos e caixas
de dica ao longo do texto · duas trilhas de leitura (Iniciante e Avançada).

**Dor central (palavras do próprio ebook):** a maioria usa IA como usava o Google — pergunta curta, lê a
resposta e fecha a aba — e deixa de fora quase todo o potencial.

**Objeções previstas:** "preciso saber programar?", "é para iniciante?", "vai ficar desatualizado?",
"qual o formato?", "tem garantia?".

**Intenção de busca:** "curso/ebook de inteligência artificial", "como usar IA na prática", "prompts prontos",
"automações com IA", "ebook IA para iniciantes".

**Persona:** profissional ou empreendedor de 20–50 anos, usa ChatGPT de vez em quando, sente que "deveria
usar mais" mas não sabe por onde começar; navega no celular (Instagram/WhatsApp); decide rápido se a
promessa estiver clara.

## 3. Benchmark (proporcional ao escopo)

Fontes consultadas (artigos de boas práticas em PT-BR sobre landing pages de alta conversão e exemplos de
landing pages de ebook): Yav, SeedProd (exemplos de ebook), Shopify BR, HeroSpark. Limitação: não foi
possível abrir/auditar páginas de vendas concorrentes específicas; o benchmark reflete padrões documentados.

Padrões adotados:
- Objetivo único e CTA repetido ao longo da página (hero, meio, oferta, final, barra fixa no mobile).
- Mockup 3D do livro como elemento visual principal (torna o produto tangível).
- Cabeçalho mínimo (logo + CTA), sem menus que desviem a atenção.
- Prova de valor antes da oferta: sumário detalhado, páginas reais, prompts reais.
- Velocidade: HTML/CSS/JS enxutos, imagens WebP com `srcset`, fontes locais subsetadas.

Oportunidades de diferenciação: mostrar o produto "por dentro" (páginas reais + prompts reais) em vez de
promessas genéricas; honestidade (sem escassez falsa, sem depoimentos inventados).

## 4. Estratégia

- **Promessa (H1):** parar de usar a IA "como o Google" e colocá-la para trabalhar.
- **Mensagens:** (1) do zero ao avançado numa trilha só; (2) prompts, ferramentas e automações práticas;
  (3) plano de 30 dias; (4) foco no que não muda (princípios), não em modas.
- **Hierarquia:** Hero → números → ferramentas → problema → benefícios → conteúdo → por dentro → prompts
  reais → para quem → plano 30 dias → oferta → FAQ → CTA final.
- **Conversão:** CTA primário âmbar (alto contraste com a paleta violeta/ciano), 5+ pontos de CTA.
- **Prova social:** o projeto não recebeu depoimentos, números de vendas ou avaliações → **nenhum foi inventado**.
  A prova usada é o próprio produto (conteúdo verificável). Quando houver depoimentos reais, há um bloco
  pronto para inserir (ver README).
- **Critérios de sucesso:** taxa de clique nos CTAs de compra, tempo na página, rolagem até a oferta.

## 5. UX

Mobile first. Jornada: entende a promessa (5 s) → reconhece o problema → vê o que ganha → confere o conteúdo
→ testa um prompt → vê o plano → decide na oferta → tira dúvidas → compra. Botões ≥ 48 px de altura,
barra de CTA fixa no mobile após o hero, FAQ em `<details>` nativo (funciona sem JS), foco visível,
`prefers-reduced-motion` respeitado.

## 6. UI e Design System

**Identidade:** extraída do ebook (cores por parte do livro + Inter/Sora). Personalidade: tecnológica,
amigável, vibrante.

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#0a0e22` | fundo escuro (hero, rodapé), texto principal |
| `--violet` | `#7c5cff` (`--violet-600` `#5b3fe0`) | marca / Parte 1 |
| `--cyan` | `#22d3ee` | destaque / gradiente |
| `--teal` | `#14b8a6` | Parte 2 |
| `--pink` | `#ec4899` | Parte 3 |
| `--amber` | `#ffb020` → `#ff7a3d` | CTA de compra / Parte 4 |
| `--lav` | `#f4f2ff` | superfícies claras |
| `--muted` | `#4b5275` | texto secundário (contraste ≥ 7:1 sobre branco) |

- **Tipografia:** Inter Display ExtraBold (títulos), Inter 400/600 (texto), auto-hospedadas (WOFF subset latin).
  A fonte de marca do ebook é Sora; não estava disponível offline neste ambiente — para usá-la, basta
  adicionar o arquivo e trocar `--font-display` (ver README).
- **Espaçamento:** escala de 4/8 px. **Raios:** 14 / 22 / 32 px e pílula. **Sombras:** 3 níveis.
- **Motion:** 200–500 ms, `cubic-bezier(.2,.7,.2,1)`, reveal ao rolar, flutuação do livro, marquee de ferramentas.
- **Grid:** container 1200 px, 12 colunas no desktop.

## 7. Wireframe (ordem das seções)

```
[Barra de aviso]
[Header: logo | CTA]
[HERO: H1 + sub + CTAs + bullets | mockup 3D + selos]
[Faixa de números: 77 págs · 14 caps · +45 ferramentas · 10 prompts · 30 dias]
[Marquee de ferramentas]
[PROBLEMA: 3 cards + frase-ponte]
[BENEFÍCIOS: grade bento 8 cards]
[CONTEÚDO: 4 partes coloridas com capítulos + bônus]
[POR DENTRO: carrossel de páginas reais]
[PROMPTS REAIS: 3 prompts com "copiar"]
[PARA QUEM: trilhas Iniciante/Avançada + perfis]
[PLANO DE 30 DIAS: 4 semanas]
[OFERTA: o que está incluso + CTA + garantia/preço (config)]
[FAQ]
[CTA FINAL]
[Rodapé: legais + aviso de marcas]
[Barra fixa mobile] [Aviso de cookies*]
```
*somente se Google Analytics estiver configurado.
