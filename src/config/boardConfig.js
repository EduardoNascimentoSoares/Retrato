const tileCoordinates = [{ "top": "88.99", "left": "10.05" }, { "top": "90.57", "left": "22.35" }, { "top": "90.28", "left": "28.85" }, { "top": "91.14", "left": "34.65" }, { "top": "90.71", "left": "41.35" }, { "top": "90.42", "left": "47.45" }, { "top": "90.57", "left": "54.05" }, { "top": "90.86", "left": "60.85" }, { "top": "90.71", "left": "66.85" }, { "top": "90.57", "left": "73.25" }, { "top": "90.86", "left": "79.85" }, { "top": "91.00", "left": "85.95" }, { "top": "91.00", "left": "92.85" }, { "top": "81.94", "left": "93.85" }, { "top": "73.03", "left": "92.85" }, { "top": "73.46", "left": "86.35" }, { "top": "73.75", "left": "80.05" }, { "top": "74.18", "left": "74.65" }, { "top": "73.46", "left": "67.85" }, { "top": "63.11", "left": "67.75" }, { "top": "49.02", "left": "68.05" }, { "top": "43.70", "left": "61.25" }, { "top": "44.42", "left": "55.25" }, { "top": "54.48", "left": "54.85" }, { "top": "63.54", "left": "55.05" }, { "top": "73.46", "left": "54.85" }, { "top": "73.60", "left": "46.95" }, { "top": "73.17", "left": "40.75" }, { "top": "73.32", "left": "34.85" }, { "top": "73.60", "left": "28.15" }, { "top": "73.75", "left": "22.65" }, { "top": "73.03", "left": "16.05" }, { "top": "62.97", "left": "15.95" }, { "top": "54.92", "left": "15.75" }, { "top": "45.72", "left": "15.65" }, { "top": "36.66", "left": "15.65" }, { "top": "26.74", "left": "15.95" }, { "top": "26.74", "left": "22.35" }, { "top": "27.60", "left": "28.85" }, { "top": "36.37", "left": "28.45" }, { "top": "51.47", "left": "28.55" }, { "top": "56.78", "left": "35.65" }, { "top": "56.07", "left": "43.15" }, { "top": "45.57", "left": "42.15" }, { "top": "36.23", "left": "42.65" }, { "top": "26.31", "left": "42.75" }, { "top": "27.03", "left": "50.45" }, { "top": "26.31", "left": "57.45" }, { "top": "26.45", "left": "64.85" }, { "top": "26.31", "left": "72.15" }, { "top": "27.31", "left": "78.35" }, { "top": "34.50", "left": "78.35" }, { "top": "42.98", "left": "78.65" }, { "top": "44.71", "left": "86.45" }, { "top": "44.28", "left": "93.25" }, { "top": "35.36", "left": "93.85" }, { "top": "25.73", "left": "94.05" }, { "top": "17.68", "left": "93.85" }, { "top": "9.34", "left": "93.85" }, { "top": "9.20", "left": "87.35" }, { "top": "8.19", "left": "77.85" }, { "top": "8.77", "left": "68.35" }, { "top": "8.63", "left": "61.05" }, { "top": "8.34", "left": "55.25" }, { "top": "8.48", "left": "48.35" }, { "top": "8.63", "left": "41.95" }, { "top": "9.06", "left": "34.85" }, { "top": "8.19", "left": "28.75" }, { "top": "8.63", "left": "22.45" }, { "top": "10.93", "left": "10.25" }]

const idxPlayer = localStorage.getItem("actualPlayer")
const idxReader = localStorage.getItem("readerPlayer")
const movementPlayer = localStorage.getItem("movementPlayer")
const movementReader = localStorage.getItem("movementReader")

if (!movementPlayer) {
    localStorage.setItem("movementPlayer", 0)
}
if (!movementReader) {
    localStorage.setItem("movementReader", 0)
}

let players = JSON.parse(localStorage.getItem("orderPlayers")) || []

const boardContainer = document.getElementById('board-container');

function createPawns() {
    players.forEach(player => {
        const pawn = document.createElement('div');
        pawn.id = `pawn-${player.id}`;
        pawn.className = 'pawn';
        pawn.style.backgroundColor = player.color;

        boardContainer.appendChild(pawn);
    });

    updateVisualPositions();
}

function calculateOffset(index, totalOnTile) {
    const distance = 12; // Distance from center in pixels

    if (totalOnTile === 1) return { x: 0, y: 0 }; // No offset needed

    const angle = (360 / totalOnTile) * index;
    const radians = angle * (Math.PI / 180);

    return {
        x: Math.cos(radians) * distance,
        y: Math.sin(radians) * distance
    };
}

function updateVisualPositions() {
    for (let i = 0; i < tileCoordinates.length; i++) {

        const occupants = players.filter(p => p.currentTile === i);

        if (occupants.length > 0) {
            const center = tileCoordinates[i]; // {top: '...', left: '...'}

            occupants.forEach((player, idx) => {
                // Calculate offset to avoid overlapping
                const offset = calculateOffset(idx, occupants.length);

                const pawnElement = document.getElementById(`pawn-${player.id}`);

                // Apply coordinates: % for position, px for offset
                pawnElement.style.top = `calc(${center.top}% + ${offset.y}px)`;
                pawnElement.style.left = `calc(${center.left}% + ${offset.x}px)`;
            });
        }
    }
}

function movePlayer(playerId, steps) {
    const player = players.find(p => p.id === playerId);

    if (player) {
        player.currentTile += steps;

        //TODO: salvar no localStorage a posiçao dos players

        if (player.currentTile >= tileCoordinates.length - 1) {
            player.currentTile = tileCoordinates.length - 1;

            //TODO: chamar a funçao de final de jogo
        }

        if (player.currentTile < 0) {
            player.currentTile = 0;
        }

        updateVisualPositions();
    }
}

createPawns();

movePlayer(idxPlayer, movementPlayer);
movePlayer(idxReader, movementReader);

// CODIGO QUE CRIA AS COORDENADAS CLICANDO NO TABULEIRO
/*
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

    // 5. Exibe no console o objeto pronto para copiar
    console.log(`Casa ${mapaTemporario.length - 1}: `, coordenada);
    
    // OPCIONAL: Se quiser copiar o ARRAY INTEIRO no final
    console.log("Array Completo até agora:", JSON.stringify(mapaTemporario));
    
    // VISUAL: Cria um pontinho vermelho onde você clicou para confirmar
    criarMarcadorVisual(percentX, percentY);
});

function criarMarcadorVisual(x, y) {
    const ponto = document.createElement('div');
    ponto.style.position = 'absolute';
    ponto.style.left = x + '%';
    ponto.style.top = y + '%';
    ponto.style.width = '10px';
    ponto.style.height = '10px';
    ponto.style.backgroundColor = 'red';
    ponto.style.borderRadius = '50%';
    ponto.style.transform = 'translate(-50%, -50%)'; // Centraliza no clique
    ponto.style.pointerEvents = 'none'; // Permite clicar "através" dele se errar
    tabuleiro.appendChild(ponto);
}
*/