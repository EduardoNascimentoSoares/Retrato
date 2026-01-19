; (function () {
    window.executeTrap = function (trap) {
        let order = getPlayers().order
        let idxPlayer = getPlayers().player
        let idxReader = getPlayers().reader
        const traps = JSON.parse(localStorage.getItem("traps"))

        switch (trap.type) {
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
                break
            case 2:
                // Volte ou avance x quantidades de casas

                if (trap.movType == 0) {
                    order[idxPlayer].currentTile < trap.quantMov ? trap.quantMov = 0 : trap.quantMov
                    order[idxPlayer].currentTile -= trap.quantMov

                    movePlayer(idxPlayer, trap.quantMov, order)
                    localStorage.setItem("orderPlayers", JSON.stringify(order))
                } else {
                    order[idxPlayer].currentTile += trap.quantMov

                    movePlayer(idxPlayer, trap.quantMov, order)
                    localStorage.setItem("orderPlayers", JSON.stringify(order))
                }
                break

            case 3:
                // Escolha alguém para avançar ou voltar x quantidade de casas

                // TODO: O pop up parece mostrar algumas inconsistências

                const divTrap = document.getElementById("trapRadio")
                const secTrap = document.getElementById("trapPopUp")

                // Limpa o conteúdo anterior para evitar duplicação
                divTrap.innerHTML = ""
                const existingTitle = secTrap.querySelector("h3")
                if (existingTitle) existingTitle.remove()

                const title = document.createElement("h3")
                if (trap.movType == 0) {
                    title.textContent = `Escolha um jogador para voltar ${trap.quantMov} casas.`
                } else {
                    title.textContent = `Escolha um jogador para avançar ${trap.quantMov} casas.`
                }

                secTrap.insertBefore(title, divTrap)

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

                const trapFound = traps.find(t => t.idx === trap.idx)

                trapFound.isActived = 1
                localStorage.setItem("traps", JSON.stringify(traps))

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

                    if (trap.movType == 0) {
                        order[chosedPlayer].currentTile < trap.quantMov ? trap.quantMov = 0 : trap.quantMov
                        order[chosedPlayer].currentTile -= trap.quantMov

                        movePlayer(chosedPlayer, trap.quantMov, order)
                        localStorage.setItem("orderPlayers", JSON.stringify(order))
                    } else {
                        order[chosedPlayer].currentTile += trap.quantMov

                        movePlayer(chosedPlayer, trap.quantMov, order)
                        localStorage.setItem("orderPlayers", JSON.stringify(order))
                    }

                    trapFound.isActived = 2
                    localStorage.setItem("traps", JSON.stringify(traps))

                    trapPopUp.classList.add("hidden")
                    togglePopUp("quizPopUp")
                }, { once: true })
                break
        }
    }

    window.verifyTraps = function () {
        const traps = JSON.parse(localStorage.getItem("traps")) || []

        if (traps.length === 0) return

        for (let i = 0; i < traps.length; i++) {
            if (traps[i].isActived === 1) {
                executeTrap(traps[i])
                return
            }
        }
    }
})();
