// js/main.js (Versão para Vercel, com Draco)
document.addEventListener('DOMContentLoaded', () => {
    
    const arContainer = document.getElementById('ar-container');

    async function carregarProduto() {
        const params = new URLSearchParams(window.location.search);
        const produtoId = params.get('produto');

        if (!produtoId) {
            arContainer.innerHTML = '<p>Erro: Nenhum produto foi especificado na URL.</p>';
            return;
        }

        try {
            const response = await fetch('produtos.json'); 
            if (!response.ok) {
                throw new Error('Não foi possível carregar o arquivo de produtos.');
            }
            const produtos = await response.json();
            
            const produto = produtos.find(p => p.id === produtoId);

            if (!produto) {
                arContainer.innerHTML = `<p>Erro: Produto com ID "${produtoId}" não foi encontrado.</p>`;
                return;
            }

            const modelViewer = document.createElement('model-viewer');
            
            // Informa ao model-viewer onde encontrar os arquivos do decodificador Draco
            modelViewer.setAttribute('draco-decoder-path', 'libs/draco/');
            
            modelViewer.setAttribute('src', produto.modelo_glb);
            modelViewer.setAttribute('alt', `Modelo 3D de ${produto.nome}`);
            modelViewer.setAttribute('ar', '');
            modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
            modelViewer.setAttribute('camera-controls', '');
            modelViewer.setAttribute('auto-rotate', '');
            modelViewer.setAttribute('shadow-intensity', '1');
            
            if (produto.modelo_usdz && produto.modelo_usdz !== "") {
                modelViewer.setAttribute('ios-src', produto.modelo_usdz);
            }

            arContainer.innerHTML = '';
            arContainer.appendChild(modelViewer);

        } catch (error) {
            console.error('Falha ao processar:', error);
            arContainer.innerHTML = `<p>Ocorreu um erro. Detalhes: ${error.message}</p>`;
        }
    }

    carregarProduto();
});