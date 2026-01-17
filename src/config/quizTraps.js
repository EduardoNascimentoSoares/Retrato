; (function () {
    window.executeTrap = function (type, movType = 0, quantMov = 10) {
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

                const divTrap = document.getElementById("trapRadio")
                const secTrap = document.getElementById("trapPopUp")

                // Limpa o conteúdo anterior para evitar duplicação
                divTrap.innerHTML = ""
                const existingTitle = secTrap.querySelector("h3")
                if (existingTitle) existingTitle.remove()

                const title = document.createElement("h3")
                if (movType == 0) {
                    title.textContent = `Escolha um jogador para voltar ${quantMov} casas.`
                } else {
                    title.textContent = `Escolha um jogador para avançar ${quantMov} casas.`
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
                         order[chosedPlayer].currentTile < quantMov ? quantMov = 0 : quantMov
                         order[chosedPlayer].currentTile -= quantMov 

                         movePlayer(chosedPlayer, quantMov, order)
                         localStorage.setItem("orderPlayers", JSON.stringify(order))
                    } else {
                         order[chosedPlayer].currentTile += quantMov

                         movePlayer(chosedPlayer, quantMov, order)
                         localStorage.setItem("orderPlayers", JSON.stringify(order))
                    }

                    trapPopUp.classList.add("hidden")
                }, { once: true })
                break
        }
    }

    window.verifyTraps = function () {
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
})();
