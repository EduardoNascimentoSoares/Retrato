; (function () {
    window.gameState = window.gameState || []
    window.questions = window.questions || []

    const outputPoints = document.getElementById("points")

    const btnShowQuiz = document.getElementById("btnShowQuiz")
    if (btnShowQuiz) btnShowQuiz.addEventListener("click", () => {
        if (typeof setUi === 'function') setUi()
    })

    const btnHideQuiz = document.getElementById("btnHideQuiz")
    if (btnHideQuiz) btnHideQuiz.addEventListener("click", () => {
        togglePopUp("quizPopUp")
    })

    window.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            checkAnswer()
        }
    })

    const btn = document.getElementById("btnResp")
    if (btn) btn.addEventListener("click", () => checkAnswer())

    window.checkAnswer = function () {
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

    window.verifyPoints = function () {
        let points = JSON.parse(localStorage.getItem("points"))

        points--
        if (outputPoints) outputPoints.textContent = points
        localStorage.setItem("points", JSON.stringify(points))

        if (points === 0) {
            const tips = document.querySelectorAll('[id^="dica"]')
            const hiddenTip = [...tips].find(tip =>
                tip.classList.contains("oculto")
            )

            if (hiddenTip) {
                hiddenTip.classList.remove("oculto")
                return
            }
            endRound()
        }
    }

    window.endRound = function () {
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

        // Reseta dicas reveladas, armadilhas e os pontos
        localStorage.removeItem("revealedTips")
        localStorage.removeItem("tipsOrder")
        localStorage.removeItem("traps")

        gameState.points = 10
        localStorage.setItem("points", gameState.points)
    }

    window.endGame = function (){
        const winner = document.getElementById("winner")
        winner.textContent = "TESTE"

        const players = JSON.parse(localStorage.getItem("orderPlayers"))
        const tileList = document.getElementById("tileList")

        for(let i = 0; i < players.length; i++){
            const li = document.createElement("li")
            li.textContent = `${players[i].name} na casa ${players[i].currentTile}`
            
            tileList.appendChild(li)
        }
    }
})();
