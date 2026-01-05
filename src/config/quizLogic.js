;(function () {
    window.gameState = window.gameState = window.gameState || []

    const btn = document.getElementById("btnResp")
    btn.addEventListener("click", checkAnswer)

    const outputPlayerAnswering = document.getElementById("answering")
    const outputPlayerReading = document.getElementById("reading")

    function getPlayers() {
        const players = JSON.parse(localStorage.getItem("players"))
        const answeringPlayer = players[2]
        const readingPlayer = players[1]

        outputPlayerAnswering.textContent = answeringPlayer
        outputPlayerReading.textContent = readingPlayer
    }

    function checkAnswer() {
        endRound()
    }

    function endRound() {
        gameState.answeringPlayer++
        gameState.readingPlayer++

        outputPlayerAnswering.textContent = gameState.answeringPlayer
        outputPlayerReading.textContent = gameState.readingPlayer
    }

    getPlayers()
})();