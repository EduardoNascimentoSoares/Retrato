; (function () {
    window.gameState = window.gameState = window.gameState || []
    window.questions = window.questions = window.questions || []

    // CHAMADAS DE FUNÇÃO

    const btnShowQuiz = document.getElementById("btnShowQuiz")
    btnShowQuiz.addEventListener("click", setUi)

    const btnHideQuiz = document.getElementById("btnHideQuiz")
    btnHideQuiz.addEventListener("click", () => {
        togglePopUp("quizPopUp")
    })

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
        addTraps()
        togglePopUp("quizPopUp")
    }

    const revealedTips = JSON.parse(localStorage.getItem("revealedTips")) || []
    function addTips() {
        const question = getQuestions().question
        const tipOrder = shuffleTipsOrder()

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

    function addTraps() {
        let traps = JSON.parse(localStorage.getItem("traps"))

        if (!traps) {
            let totalTips = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            totalTips.sort(() => Math.random() - 0.5)

            const trapsIdx = totalTips.slice(0, 3)

            traps = trapsIdx.map(idx => ({
                index: idx,
                type: Math.floor(Math.random() * 3) + 1
            }))

            gameState.traps = traps

            // fazer o traps funcionar como o gameState, adcionar indice e tipo dentro dele

            localStorage.setItem("traps", JSON.stringify(gameState.traps))
            traps = JSON.parse(localStorage.getItem("traps"))
        }


        const hints = document.querySelectorAll('[id^="dica"]')

        // Substituir este for por um forEach após mudar o traps
        traps.forEach(trap => {
            const hint = hints[trap.index]
            if (!hint) return

            switch (trap.type) {
                case 1:
                    hint.textContent = "a1"
                    break
                case 2:
                    hint.textContent = "a2"
                    break
                case 3:
                    hint.textContent = "a3"
                    break
            }
        })
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

        points--
        outputPoints.textContent = points
        localStorage.setItem("points", JSON.stringify(points))

        if (points === 0) {
            const tips = document.querySelectorAll('[id^="dica"]')
            const hiddenTip = [...tips].find(tip =>
                tip.classList.contains("oculto")
            )

            if (hiddenTip) {
                hiddenTip.classList.remove("oculto")
                //TODO: colocar pop up de mensagem aqui
                return
            }
            endRound()
        }
    }

    function endRound() {
        const playersData = getPlayers()
        const questionsData = getQuestions().questionOrder

        const order = playersData.order
        let idxPlayer = playersData.player
        let idxReader = playersData.reader

        const playerPoints = (10 - playersData.points)
        const readerPoints = playersData.points

        order[idxReader].currentTile += playerPoints
        order[idxPlayer].currentTile += readerPoints

        togglePopUp("quizPopUp")
        movePlayer(idxPlayer, playerPoints, order);
        movePlayer(idxReader, readerPoints, order);

        // movePlayersOnBoard(idxReader, idxPlayer, readerPoints, playerPoints);

        // Calculando o próximo jogador e leitor
        idxReader++
        if (idxReader >= order.length) {
            idxReader = 0
        }

        idxPlayer++
        if (idxPlayer >= order.length) {
            idxPlayer = 0
        }

        const questionsOrder = questionsData.slice(1)

        // Salvar novos valores no localStorage
        localStorage.setItem("actualPlayer", idxPlayer)
        localStorage.setItem("readerPlayer", idxReader)
        localStorage.setItem("questionsOrder", JSON.stringify(questionsOrder))
        localStorage.setItem("orderPlayers", JSON.stringify(order))

        // Resetar as dicas reveladas e os pontos
        localStorage.removeItem("revealedTips")

        gameState.points = 10
        localStorage.setItem("points", gameState.points)
    }
})();