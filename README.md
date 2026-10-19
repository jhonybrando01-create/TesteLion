# WebAR - Lion Fitness

Site estático (sem build). Abre com: `https://SEU-DOMINIO.vercel.app/?produto=sup-br-001`

## Deploy na Vercel
- Os arquivos (`index.html`, `vercel.json`...) precisam estar na RAIZ do projeto.
- Framework Preset: **Other** | Build Command: vazio | Output Directory: vazio (ou `.`)

## Adicionar produto
1. Coloque o `.glb` em `modelos/`
2. Adicione um item em `produtos.json` (`id`, `nome`, `modelo_glb`)
3. Link/QR Code: `/?produto=SEU_ID`
