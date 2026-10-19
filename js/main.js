// js/main.js (Vercel + Draco)
const container = document.getElementById('ar-container');

function mostrarMensagem(titulo, texto, links = []) {
    container.replaceChildren();
    const box = document.createElement('div');
    box.className = 'mensagem';

    const h1 = document.createElement('h1');
    h1.textContent = titulo;      // textContent: evita injeção de HTML pela URL
    box.appendChild(h1);

    if (texto) {
        const p = document.createElement('p');
        p.textContent = texto;
        box.appendChild(p);
    }
    for (const { href, label } of links) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        box.appendChild(a);
    }
    container.appendChild(box);
}

async function carregarProduto() {
    // 1. Lê a lista de produtos
    let produtos;
    try {
        const resp = await fetch('/produtos.json', { cache: 'no-cache' });
        if (!resp.ok) throw new Error(`produtos.json respondeu ${resp.status}`);
        produtos = await resp.json();
    } catch (err) {
        console.error(err);
        mostrarMensagem('Não foi possível carregar os produtos', 'Tente novamente em instantes.');
        return;
    }

    // 2. Descobre qual produto abrir (?produto=ID)
    const id = new URLSearchParams(window.location.search).get('produto');

    if (!id) {
        if (produtos.length === 1) return abrirProduto(produtos[0]);
        mostrarMensagem(
            'Escolha um produto', '',
            produtos.map(p => ({ href: `/?produto=${encodeURIComponent(p.id)}`, label: p.nome }))
        );
        return;
    }

    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        mostrarMensagem('Produto não encontrado', 'Confira se o link do QR Code está correto.');
        return;
    }
    abrirProduto(produto);
}

async function abrirProduto(produto) {
    // Garante que o <model-viewer> já foi registrado antes de usá-lo
    await customElements.whenDefined('model-viewer');

    // Decodificador Draco local (o GLB é comprimido com Draco).
    // IMPORTANTE: não existe atributo "draco-decoder-path"; o correto é
    // configurar a propriedade estática ANTES de criar o elemento.
    const ModelViewer = customElements.get('model-viewer');
    ModelViewer.dracoDecoderLocation = `${window.location.origin}/libs/draco/`;

    const mv = document.createElement('model-viewer');
    mv.setAttribute('src', produto.modelo_glb);
    mv.setAttribute('alt', `Modelo 3D de ${produto.nome}`);
    mv.setAttribute('ar', '');
    mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    mv.setAttribute('ar-scale', 'fixed');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('shadow-intensity', '1');
    mv.setAttribute('environment-image', 'neutral');
    mv.setAttribute('exposure', '1');

    // Só usa USDZ próprio se ele existir. Sem "ios-src", o model-viewer
    // gera o USDZ automaticamente a partir do GLB no iPhone/iPad.
    if (produto.modelo_usdz) mv.setAttribute('ios-src', produto.modelo_usdz);

    document.title = `${produto.nome} - Lion Fitness`;

    const botaoAr = document.createElement('button');
    botaoAr.slot = 'ar-button';
    botaoAr.className = 'ar-button';
    botaoAr.textContent = 'Ver no seu espaço (AR)';
    mv.appendChild(botaoAr);

    mv.addEventListener('load', () => document.getElementById('loader')?.remove());
    mv.addEventListener('error', (e) => {
        console.error('Erro no model-viewer:', e.detail);
        mostrarMensagem('Não foi possível carregar o modelo 3D', 'Tente recarregar a página.');
    });

    container.appendChild(mv);   // o loader fica visível até o evento "load"
}

carregarProduto();
