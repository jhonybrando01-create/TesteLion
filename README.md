# Lion Fitness - Visualizador AR

Projeto Vite + `<model-viewer>`, pronto para a Vercel.

Link de um produto: `https://SEU-DOMINIO.vercel.app/?produto=sup-br-001`

## Estrutura (tudo na RAIZ do repositório)

```
package.json      <- a Vercel detecta o projeto por este arquivo
vercel.json
index.html
src/              main.js, style.css
public/
  produtos.json   <- lista de produtos
  modelos/        <- arquivos .glb
  draco/          <- decodificador Draco
scripts/verificar.mjs
```

## Deploy
1. Suba para o GitHub com `package.json` na raiz do repositório.
2. Na Vercel: Add New > Project > escolha o repositório. Root Directory vazio.
3. As configurações de build já vêm do `vercel.json`. Clique em Deploy.

## Novo produto
1. Coloque o `.glb` em `public/modelos/`
2. Adicione em `public/produtos.json`: `id`, `nome`, `modelo_glb` (ex.: `/modelos/arquivo.glb`)
3. `git add . && git commit -m "novo produto" && git push`

O build valida o `produtos.json` e avisa se algum arquivo estiver faltando.

## Local
```
npm install
npm run dev
```
