// Roda antes do build. Falha com mensagem clara se algo estiver errado,
// em vez de publicar um site quebrado.
import fs from 'node:fs';
import path from 'node:path';

const raiz = process.cwd();
const erros = [];

const arquivo = (p) => path.join(raiz, 'public', p.replace(/^\//, ''));

let produtos = [];
try {
  produtos = JSON.parse(fs.readFileSync(arquivo('produtos.json'), 'utf8'));
  if (!Array.isArray(produtos) || produtos.length === 0) erros.push('produtos.json está vazio ou não é uma lista.');
} catch (e) {
  erros.push(`produtos.json inválido: ${e.message}`);
}

const ids = new Set();
for (const p of produtos) {
  if (!p.id || !p.nome || !p.modelo_glb) erros.push(`Produto incompleto (precisa de id, nome, modelo_glb): ${JSON.stringify(p)}`);
  if (ids.has(p.id)) erros.push(`ID repetido: ${p.id}`);
  ids.add(p.id);
  for (const campo of ['modelo_glb', 'modelo_usdz']) {
    if (p[campo] && !fs.existsSync(arquivo(p[campo]))) erros.push(`Arquivo não encontrado para "${p.id}": public${p[campo]}`);
  }
}

for (const f of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) {
  if (!fs.existsSync(arquivo(`draco/${f}`))) erros.push(`Falta public/draco/${f}`);
}

if (erros.length) {
  console.error('\n✖ Verificação falhou:\n' + erros.map((e) => ' - ' + e).join('\n') + '\n');
  process.exit(1);
}
console.log(`✔ Verificação ok (${produtos.length} produto(s)).`);
