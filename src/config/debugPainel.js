const btnDebug = document.getElementById('btnToggleDebug');
const painel = document.getElementById('painelDebug');

btnDebug.addEventListener('click', () => {
    painel.classList.toggle('hidden');
});

function debugMover(direcao) {
    const idInput = document.getElementById('debugPlayerId').value;
    const passosInput = document.getElementById('debugSteps').value;

    const order = JSON.parse(localStorage.getItem("orderPlayers"))
    const id = parseInt(idInput);
    const passos = parseInt(passosInput) * direcao; // Multiplica por -1 se for voltar

    order[id].currentTile += passos
    localStorage.setItem("orderPlayers", JSON.stringify(order))

    movePlayer(id, passos, order); 
}