const tabuleiro = document.getElementById('tabuleiro-container');

// Array para guardar as coordenadas temporariamente
let mapaTemporario = [];

tabuleiro.addEventListener('click', (e) => {
    // 1. Pega as dimensões atuais da imagem/container
    const rect = tabuleiro.getBoundingClientRect();

    const larguraTotal = rect.width;
    const alturaTotal = rect.height;

    // 2. Pega a posição do clique RELATIVA ao container (não à tela inteira)
    // e.clientX é o clique na tela, rect.left é onde o container começa
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. Regra de 3 para achar a porcentagem
    // Se a largura é 1000px e cliquei no 500px, então 500/1000 = 0.5 * 100 = 50%
    const percentX = (x / larguraTotal) * 100;
    const percentY = (y / alturaTotal) * 100;

    // 4. Formata para ficar bonito (2 casas decimais)
    const coordenada = {
        top: percentY.toFixed(2),
        left: percentX.toFixed(2)
    };

    mapaTemporario.push(coordenada);

    // VISUAL: Cria um pontinho vermelho onde você clicou para confirmar
    criarMarcadorVisual(percentX, percentY);
});

let marcadoresVisuais = []

function criarMarcadorVisual(x, y) {
    const ponto = document.createElement('div');
    ponto.style.position = 'absolute';
    ponto.style.left = x + '%';
    ponto.style.top = y + '%';
    ponto.style.width = '15px';
    ponto.style.height = '15px';
    ponto.style.backgroundColor = 'red';
    ponto.style.borderRadius = '50%';
    ponto.style.transform = 'translate(-50%, -50%)'; // Centraliza no clique
    ponto.style.cursor = 'pointer';

    // Guarda a posição no próprio elemento
    ponto.dataset.x = x.toFixed(2);
    ponto.dataset.y = y.toFixed(2);

    // Clique para deletar
    ponto.addEventListener('click', (e) => {
        e.stopPropagation(); // evita criar outro marcador por baixo
        deletarMarcadorVisual(ponto);
    });

    tabuleiro.appendChild(ponto);
    marcadoresVisuais.push(ponto);
}

function deletarMarcadorVisual(ponto) {
    // Remove do DOM
    ponto.remove();

    // Remove do array visual
    marcadoresVisuais = marcadoresVisuais.filter(p => p !== ponto);

    // Remove do mapaTemporario
    mapaTemporario = mapaTemporario.filter(coord =>
        coord.left !== ponto.dataset.x ||
        coord.top !== ponto.dataset.y
    );
}


const btnSaveBoard = document.getElementById("saveBoard");

btnSaveBoard.addEventListener("click", () => {
    saveBoard(mapaTemporario)
});

function saveBoard(board) {
    if (!board.length) {
        alert("Nenhuma casa criada!");
        return;
    }

    const content =
        `const boardMap = function () {
    window.tabuleiro = ${JSON.stringify(board, null, 2)};
    return tabuleiro;
}();`;

    const file = new Blob(
        [content],
        { type: "text/javascript" }
    );

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabuleiro.js";
    a.click();

    URL.revokeObjectURL(url);

    // location.href = "../../index.html"
}