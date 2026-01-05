; (function () {
    window.gameState = window.gameState = window.gameState || []

    // Chamadas das funções

    window.addEventListener("load", () => {
        createPlayersInputs(numPlayers.value)
    })

    const numPlayers = document.getElementById("numPlayers")
    numPlayers.addEventListener("change", () => {
        createPlayersInputs(numPlayers.value)
    })

    const btnSave = document.getElementById("btnSavePlayers")
    btnSave.addEventListener("click", savePlayers)

    // Funções de Construção

    function createPlayersInputs(max) {
        const divPlayers = document.getElementById("playersInput")
        divPlayers.innerHTML = ""

        for (let i = 0; i < max; i++) {
            const inputName = document.createElement("input")
            const labelName = document.createElement("label")

            const inputColor = document.createElement("input")
            const labelColor = document.createElement("label")

            const p = document.createElement("p")

            p.textContent = `Jogador ${i + 1}`

            labelName.for = `playerName${i}`
            labelName.textContent = `Escolha o nome do jogador`

            inputName.id = `playerName${i}`
            inputName.type = "text"
            inputName.placeholder = `Nome do Jogador`

            labelColor.for = `playerColor${i}`
            labelColor.textContent = `Escolha a cor do jogador`

            inputColor.type = "color"
            inputColor.id = `playerColor${i}`

            divPlayers.appendChild(p)
            divPlayers.appendChild(labelName)
            divPlayers.appendChild(inputName)
            divPlayers.appendChild(labelColor)
            divPlayers.appendChild(inputColor)
        }
    }

    // funções lógicas

    function randomizeReader(playersList) {
        const chosenIndex = Math.floor(Math.random() * playersList.length)
        playersList[chosenIndex].type = "reader"
        return chosenIndex
    }

    function shuffleOrder(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
        }

        const shuffledArray = array
        const spanOutput = document.getElementById("playerOrder")
        let names = ''

        for (let i = 0; i < shuffledArray.length; i++) {
            names += shuffledArray[i].name
            if (names == "") {
                alert("coleque nomes")
                return
            }
            if (i < shuffledArray.length - 1) {
                names += ", "
            }
        }

        spanOutput.textContent = names

        return array
    }

    function savePlayers() {
        localStorage.removeItem("players")
        localStorage.removeItem("orderPlayers")

        const playersList = gameState.playersData
        playersList.length = 0

        for (let i = 0; i < numPlayers.value; i++) {
            const nameInput = document.getElementById(`playerName${i}`)
            const colorInput = document.getElementById(`playerColor${i}`)

            const player = {
                id: i,
                name: nameInput.value.trim(),
                color: colorInput.value,
                currentTile: 0,
                type: ""
            }
            playersList.push(player)

            nameInput.value = ""
            colorInput.value = "#000000"
        }

        gameState.playersOrder = shuffleOrder(playersList)
        
        if(playersList[0].type == ""){
            gameState.actualPlayer = playersList[0]
        }else{
            gameState.actualPlayer = playersList[1]
        }

        localStorage.setItem("players", JSON.stringify(playersList))
        localStorage.setItem("orderPlayers", JSON.stringify(gameState.playersOrder))
    }
})();