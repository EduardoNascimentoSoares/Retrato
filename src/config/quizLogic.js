; (function () {
    window.gameState = window.gameState = window.gameState || []

    // CHAMADAS DE FUNÇÃO

    window.addEventListener("load", setUi)
    window.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            checkAnswer()
        }
    })
    const btn = document.getElementById("btnResp")
    btn.addEventListener("click", checkAnswer)

    // FUNÇÕES DE CONSTRUÇÃO

    const outputPlayerAnswering = document.getElementById("answering")
    const outputPlayerReading = document.getElementById("reading")


    function getPlayers() {
        const players = JSON.parse(localStorage.getItem("orderPlayers"))
        const actualPlayer = JSON.parse(localStorage.getItem("actualPlayer"))
        const readerPlayer = JSON.parse(localStorage.getItem("readerPlayer"))

        return {
            order: players,
            player: actualPlayer,
            reader: readerPlayer
        }
    }

    function getQuestions(){
        
    }

    function setUi() {
        const data = getPlayers()
        const idxPlayer = data.player
        const idxReader = data.reader

        outputPlayerAnswering.textContent = data.order[idxPlayer].name
        outputPlayerReading.textContent = data.order[idxReader].name
    }

    // FUNÇÕES LÓGICAS

    function checkAnswer() {
        const answer = document.getElementById("chute")
        const answerValue = answer.value.trim().toLowerCase()

        if (answerValue === "teste") {
            alert("Acertou!")
            endRound()
            return
        }

        const playersData = getPlayers()
        const order = playersData.order
        let idxPlayer = playersData.player
        const idxReader = playersData.reader

        idxPlayer++

        if (idxPlayer >= order.length) {
            idxPlayer = 0
        }

        if (idxPlayer === idxReader) {
            idxPlayer++

            if (idxPlayer >= order.length) {
                idxPlayer = 0
            }
        }

        localStorage.setItem("actualPlayer", idxPlayer)

        answer.value = ""
    }

    function endRound() {
        const playersData = getPlayers()
        const order = playersData.order
        let idxPlayer = playersData.player
        let idxReader = playersData.reader

        idxReader++

        if (idxReader >= order.length) {
            idxReader = 0
        }

        idxPlayer++

        if (idxPlayer >= order.length) {
            idxPlayer = 0
        }

        localStorage.setItem("readerPlayer", idxReader)
        localStorage.setItem("actualPlayer", idxPlayer)
    }
})();