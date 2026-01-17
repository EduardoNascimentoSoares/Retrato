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

        // Adcionando as dicas e Armadilhas
        verifyTraps()
        addTips()
        addTraps()
        togglePopUp("quizPopUp")
    }

    function addTips() {
        const revealedTips = JSON.parse(localStorage.getItem("revealedTips")) || []
        gameState.revealedTips = [...revealedTips]

        const question = getQuestions().question
        const tipOrder = shuffleTipsOrder()

        for (let i = 0; i < 10; i++) {
            let hint = document.getElementById(`dica${i + 1}`)

            const newHint = hint.cloneNode(true)
            hint.parentNode.replaceChild(newHint, hint)
            hint = newHint

            hint.textContent = question[`Dica${tipOrder[i]}`]

            hint.classList.add("oculto")

            if (revealedTips.includes(tipOrder[i])) {
                hint.classList.remove("oculto")
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
        const tipsOrder = JSON.parse(localStorage.getItem("tipsOrder"))

        if (!traps) {
            let totalTips = tipsOrder

            const trapsIdx = totalTips.slice(0, 3)

            traps = trapsIdx.map(index => {
                // const type = Math.floor(Math.random() * 3) + 1
                const type = 3

                const trap = {
                    idx: index,
                    type: type
                }

                if (type === 2) {
                    trap.movType = Math.floor(Math.random() * 2)
                    trap.quantMov = Math.floor(Math.random() * 10) + 1
                }

                if (type === 3) {
                    // trap.movType = Math.floor(Math.random() * 2)
                    trap.movType = 0
                    // trap.quantMov = Math.floor(Math.random() * 10) + 1
                    trap.quantMov = 10
                    trap.isActived = 0
                }

                return trap
            })

            gameState.traps = traps

            localStorage.setItem("traps", JSON.stringify(gameState.traps))
            traps = JSON.parse(localStorage.getItem("traps"))
        }

        const hints = document.querySelectorAll('[id^="dica"]')

        traps.forEach(trap => {
            const hint = hints[trap.idx]
            if (!hint) return

            const revealedTips = JSON.parse(localStorage.getItem("revealedTips")) || []

            switch (trap.type) {
                case 1:
                    hint.textContent = "Perdeu a Vez!"
                    break
                case 2:
                    if (trap.movType == 0) {
                        hint.textContent = `Volte ${trap.quantMov} casas`
                    } else {
                        hint.textContent = `Avance ${trap.quantMov} casas`
                    }
                    break
                case 3:
                    if (trap.movType == 0) {
                        hint.textContent = `Escolha alguém para voltar ${trap.quantMov} casas`
                    } else {
                        hint.textContent = `Escolha alguém para avançar ${trap.quantMov} casas`
                    }
                    break
            }

            if (!revealedTips.includes(trap.idx)) {
                hint.addEventListener("click", () => {
                    executeTrap(trap.type, trap.movType, trap.quantMov)
                }, { once: true })
            }
        })
    }

    // FUNÇÕES LÓGICAS

    function executeTrap(type, movType = 0, quantMov = 10) {
        let order = getPlayers().order
        let idxPlayer = getPlayers().player
        let idxReader = getPlayers().reader
        const traps = JSON.parse(localStorage.getItem("traps"))

        switch (type) {
            case 1:
                // Perdeu a vez

                idxPlayer++

                if (idxPlayer >= order.length) {
                    idxPlayer = 0
                }

                if (idxPlayer == idxReader) {
                    idxPlayer++

                    if (idxPlayer >= order.length) {
                        idxPlayer = 0
                    }
                }

                gameState.actualPlayer = idxPlayer
                localStorage.setItem("actualPlayer", JSON.stringify(gameState.actualPlayer))

                alert("perdeu a vez")
                break
            case 2:
                // Volte ou avance x quantidades de casas

                if (movType == 0) {
                    order[idxPlayer].currentTile < quantMov ? quantMov = 0 : quantMov
                    order[idxPlayer].currentTile -= quantMov

                    movePlayer(idxPlayer, quantMov, order)
                    localStorage.setItem("orderPlayers", JSON.stringify(order))
                } else {
                    order[idxPlayer].currentTile += quantMov

                    movePlayer(idxPlayer, quantMov, order)
                    localStorage.setItem("orderPlayers", JSON.stringify(order))
                }
                break

            case 3:
                // Escolha alguém para avançar ou voltar x quantidade de casas

                // TODO: o codigo abre uma vez o pop up da armadilha e dps nunca mais fecha (criar um "isExecuted no traps")
                // TODO: o player escolhido n anda

                const divTrap = document.getElementById("trapRadio")
                const secTrap = document.getElementById("trapPopUp")

                const title = document.createElement("h3")
                if (movType == 0) {
                    title.textContent = `Escolha um jogador para voltar ${quantMov} casas.`
                } else {
                    title.textContent = `Escolha um jogador para avançar ${quantMov} casas.`
                }

                secTrap.appendChild(title)

                for (let i = 0; i < order.length; i++) {
                    if (idxPlayer != i) {
                        const namePlayers = order[i].name
                        const nameInput = document.createElement("input")
                        nameInput.type = "radio"
                        nameInput.name = "namePlayers"
                        nameInput.id = `np${i + 2}`
                        nameInput.value = i + 2

                        const nameLabel = document.createElement("label")
                        nameLabel.htmlFor = `np${i + 2}`
                        nameLabel.id = `namePlayer${i + 2}`
                        nameLabel.textContent = namePlayers

                        divTrap.appendChild(nameInput)
                        divTrap.appendChild(nameLabel)
                    }
                }

                const choiceButton = document.getElementById("btnTrap")

                const trapPopUp = document.getElementById("trapPopUp")
                trapPopUp.classList.remove("hidden")

                choiceButton.addEventListener("click", () => {
                    const chosedPlayerInput = document.querySelector('input[name="namePlayers"]:checked')

                    if (!chosedPlayerInput) {
                        alert("Selecione um jogador primeiro")
                        return
                    }

                    const chosedPlayer = Number(chosedPlayerInput.id.replace("np", "")) - 2

                    localStorage.setItem("traps", JSON.stringify(traps))

                    if (movType == 0) {
                        // order[chosedPlayer].currentTile < quantMov ? quantMov = 0 : quantMov
                        // order[chosedPlayer].currentTile += quantMov // mude isso aqui

                        // movePlayer(chosedPlayer, quantMov, order)
                        // localStorage.setItem("orderPlayers", JSON.stringify(order))
                    } else {
                        // order[chosedPlayer].currentTile += quantMov

                        // movePlayer(chosedPlayer, quantMov, order)
                        // localStorage.setItem("orderPlayers", JSON.stringify(order))
                    }

                    trapPopUp.classList.add("hidden")
                }, { once: true })
                break
        }
    }

    function verifyTraps() {
        const revealedTips = JSON.parse(localStorage.getItem("revealedTips")) || []
        const traps = JSON.parse(localStorage.getItem("traps")) || []

        if (revealedTips.length === 0 || traps.length === 0) return

        for (let i = 0; i < traps.length; i++) {
            if (revealedTips.includes(traps[i].idx) && traps[i].isActived === 0) {
                executeTrap(traps[i].type, traps[i].movType, traps[i].quantMov)
            }
        }

        localStorage.setItem("traps", JSON.stringify(traps))
    }

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
})();