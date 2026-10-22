// Uso: node scripts/set-domain.mjs https://www.seudominio.com.br
// Troca o domínio provisório (https://SEU-DOMINIO.com.br) em canonical, Open Graph, JSON-LD, robots e sitemap.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const target = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[^\s/]+\.[^\s/]+$/.test(target)) {
  console.error("Informe o domínio completo com https. Ex.: node scripts/set-domain.mjs https://www.seudominio.com.br");
  process.exit(1);
}
const PLACEHOLDER = "https://SEU-DOMINIO.com.br";
const exts = new Set([".html", ".xml", ".txt"]);
let changed = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".git")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(p))) {
      const src = readFileSync(p, "utf8");
      if (src.includes(PLACEHOLDER)) { writeFileSync(p, src.split(PLACEHOLDER).join(target)); changed++; console.log("atualizado:", p); }
    }
  }
})(process.cwd());
console.log(`Pronto: ${changed} arquivo(s) atualizado(s) para ${target}`);
