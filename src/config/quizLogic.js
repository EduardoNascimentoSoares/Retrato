; (function () {
    window.gameState = window.gameState = window.gameState || []
    window.questions = window.questions = window.questions || []

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
    const outputCategory = document.getElementById("category")
    const outputResponse = document.getElementById("response")
    const outputPoints = document.getElementById("points")


    function getPlayers() {
        const players = JSON.parse(localStorage.getItem("orderPlayers"))
        const actualPlayer = JSON.parse(localStorage.getItem("actualPlayer"))
        const readerPlayer = JSON.parse(localStorage.getItem("readerPlayer"))
        const getPoints = JSON.parse(localStorage.getItem("points"))
        if (!getPoints) {
            localStorage.setItem("points", JSON.stringify(gameState.points))
        }

        return {
            order: players,
            player: actualPlayer,
            points: getPoints,
            reader: readerPlayer
        }
    }

    function getQuestions() {
        if (!localStorage.getItem("questionsOrder")) {
            gameState.questionsOrder = shuffleQuestionsOrder()
            localStorage.setItem("questionsOrder", JSON.stringify(gameState.questionsOrder))
        }
        gameState.questionOrder = JSON.parse(localStorage.getItem("questionsOrder"))

        return {
            question: window.questions[gameState.questionOrder[0]],
            questionOrder: gameState.questionOrder
        }
    }

    function shuffleQuestionsOrder() {
        const questionsOrder = Array.from(
            { length: window.questions.length },
            (_, i) => i)

        for (let i = questionsOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[questionsOrder[i], questionsOrder[j]] = [questionsOrder[j], questionsOrder[i]]
        }

        return questionsOrder
    }

    function shuffleTipsOrder() {
        if (localStorage.getItem("tipsOrder")) {
            return JSON.parse(localStorage.getItem("tipsOrder"))
        }

        const tipsOrder = []
        for (let i = 0; i < 10; i++) {
            tipsOrder.push(i + 1)
        }

        for (let i = tipsOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[tipsOrder[i], tipsOrder[j]] = [tipsOrder[j], tipsOrder[i]]
        }

        gameState.tipsOrder = tipsOrder
        localStorage.setItem("tipsOrder", JSON.stringify(gameState.tipsOrder))
        return tipsOrder
    }

    function setUi() {
        const playerData = getPlayers()
        const question = getQuestions().question

        // Adcionando o Player
        const idxPlayer = playerData.player
        const idxReader = playerData.reader
        const points = playerData.points

        outputPlayerAnswering.textContent = playerData.order[idxPlayer].name
        outputPlayerReading.textContent = playerData.order[idxReader].name
        outputPoints.textContent = points
        outputCategory.textContent = question.Categoria
        outputResponse.textContent = question.Resposta

        outputResponse.addEventListener("click", () => {
            outputResponse.classList.remove("oculto")
        })

        // Adcionando as dicas
        addTips()
    }

    function addTips() {
        const question = getQuestions().question
        const tipOrder = shuffleTipsOrder()
        const revealedTips = JSON.parse(localStorage.getItem("revealedTips")) || []

        for (let i = 0; i < 10; i++) {
            const hint = document.getElementById(`dica${i + 1}`)
            hint.textContent = question[`Dica${tipOrder[i]}`]

            if (revealedTips.includes(tipOrder[i])) {
                hint.classList.remove("oculto")
                gameState.revealedTips.push(tipOrder[i])
                continue
            }

            hint.addEventListener("click", () => {
                hint.classList.remove("oculto")
                gameState.revealedTips.push(tipOrder[i])
                localStorage.setItem("revealedTips", JSON.stringify(gameState.revealedTips))
                verifyPoints()
            }, { once: true })
        }
    }

    // FUNÇÕES LÓGICAS

    function checkAnswer() {
        const answer = document.getElementById("chute")
        const answerValue = answer.value.trim().toLowerCase()
        const question = getQuestions().question
        const resp = question.Resposta.trim().toLowerCase()

        if (answerValue === resp) {
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

    function verifyPoints() {
        let points = JSON.parse(localStorage.getItem("points"))
        // Este caso não deve existir
        // Olhar como o jogo é jogado nesta questão
        if (points > 1) {
            points--
            outputPoints.textContent = points
            localStorage.setItem("points", JSON.stringify(points))
        } else {
            alert(`O jogador andará ${1} e a pessoa que esta lendo andará ${10}`)
            endRound()
        }
    }

    function endRound() {
        const playersData = getPlayers()
        const questionsData = getQuestions().questionOrder

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

        const questionsOrder = questionsData.slice(1)
        gameState.points = 10

        let playerTile = localStorage.getItem("movementPlayer")
        playerTile = playersData.points
        
        let readerTile = localStorage.getItem("movementReader")
        readerTile = (10 - playersData.points)

        localStorage.setItem("readerPlayer", idxReader)
        localStorage.setItem("actualPlayer", idxPlayer)
        localStorage.setItem("questionsOrder", JSON.stringify(questionsOrder))
        localStorage.setItem("points", gameState.points)
        localStorage.setItem("movementPlayer", playerTile)
        localStorage.setItem("movementReader", readerTile)
        localStorage.removeItem("revealedTips")

        location.href = "../pages/board.html"
    }
})();