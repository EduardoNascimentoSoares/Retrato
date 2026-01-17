; (function () {
    const outputPlayerAnswering = document.getElementById("answering")
    const outputPlayerReading = document.getElementById("reading")
    const outputCategory = document.getElementById("category")
    const outputResponse = document.getElementById("response")
    const outputPoints = document.getElementById("points")

    window.setUi = function () {
        const playerData = getPlayers()
        const question = getQuestions().question

        // Adcionando o Player
        const idxPlayer = playerData.player
        const idxReader = playerData.reader
        const points = playerData.points

        if(outputPlayerAnswering) outputPlayerAnswering.textContent = playerData.order[idxPlayer].name
        if(outputPlayerReading) outputPlayerReading.textContent = playerData.order[idxReader].name
        if(outputPoints) outputPoints.textContent = points
        if(outputCategory) outputCategory.textContent = question.Categoria
        if(outputResponse) outputResponse.textContent = question.Resposta

        if(outputResponse) {
            outputResponse.addEventListener("click", () => {
                outputResponse.classList.remove("oculto")
            })
        }

        // Adcionando as dicas e Armadilhas
        verifyTraps()
        addTips()
        addTraps()
        togglePopUp("quizPopUp")
    }

    window.addTips = function () {
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
                if (typeof verifyPoints === 'function') verifyPoints()
            }, { once: true })
        }
    }

    window.addTraps = function () {
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
})();
