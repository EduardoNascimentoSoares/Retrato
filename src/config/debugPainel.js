const btnDebug = document.getElementById('btn-toggle-debug');
const painel = document.getElementById('painel-debug');

btnDebug.addEventListener('click', () => {
    painel.classList.toggle('hidden');
});

function debugMover(direcao) {
    const idInput = document.getElementById('debug-player-id').value;
    const passosInput = document.getElementById('debug-steps').value;
    
    const id = parseInt(idInput);
    const passos = parseInt(passosInput) * direcao; // Multiplica por -1 se for voltar
    
    movePlayer(id, passos); 
}