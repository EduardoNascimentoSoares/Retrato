; (function () {
    window.gameState = window.gameState = window.gameState || []

    // CHAMADAS DE FUNÇÕES

    if (localStorage.getItem("orderPlayers")) {
        hideMenu()
    }

    let numPlayers = document.querySelector('input[name="numPlayers"]:checked').value
    window.addEventListener("load", () => {
        createPlayersInputs(numPlayers)
    })

    const playerRadios = document.querySelectorAll('input[name="numPlayers"]');
    playerRadios.forEach(radio => {
        radio.addEventListener('change', (evento) => {
            numPlayers = evento.target.value;
            createPlayersInputs(numPlayers);
        });
    });

    const btnSave = document.getElementById("btnSavePlayers")
    btnSave.addEventListener("click", savePlayers)

    // FUNÇÕES DE CONSTRUÇÃO

    function createPlayersInputs(max) {
        const divPlayers = document.getElementById("playersInput")
        divPlayers.innerHTML = ""

        for (let i = 0; i < max; i++) {
            const inputName = document.createElement("input")
            const labelName = document.createElement("label")

            const inputColor = document.createElement("input")
            const labelColor = document.createElement("label")

            const div = document.createElement("div")
            const p = document.createElement("p")

            p.textContent = `Jogador ${i + 1}`

            labelName.for = `playerName${i}`
            labelName.textContent = `Escolha o nome do jogador:`

            inputName.id = `playerName${i}`
            inputName.type = "text"
            inputName.placeholder = `Nome do Jogador`

            labelColor.for = `playerColor${i}`
            labelColor.textContent = `Escolha a cor do jogador:`

            inputColor.type = "color"
            inputColor.id = `playerColor${i}`

            div.appendChild(p)
            div.appendChild(labelName)
            div.appendChild(inputName)
            div.appendChild(labelColor)
            div.appendChild(inputColor)
            divPlayers.appendChild(div)
        }
    }

    function hideMenu() {
        const playersConfigMenu = document.getElementById("playersConfigMenu")
        playersConfigMenu.classList.add("hidden")

        const background = document.getElementById("backgound")
        background.classList.remove("blur")
    }

    // FUNÇÕES LÓGICAS

    function randomizeReader(playersList) {
        const chosenIndex = Math.floor(Math.random() * playersList.length)
        playersList[chosenIndex].type = "reader"
        return chosenIndex
    }

    function shufflePlayersOrder(array) {
        array.forEach((player) => {
            if (!player.name || player.name.trim() === "") {
                player.name = `Jogador ${player.id + 1}`
            }
        })

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
        }

        const spanOutput = document.getElementById("playerOrder")

        spanOutput.textContent = array.map(p => p.name).join(", ")

        return array
    }

    function savePlayers() {
        localStorage.removeItem("orderPlayers")
        localStorage.removeItem("actualPlayers")
        localStorage.removeItem("readerPlayers")

        const playersList = []
        playersList.length = 0

        for (let i = 0; i < numPlayers; i++) {
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

        let idxReaderPlayer = randomizeReader(playersList)
        gameState.playersOrder = shufflePlayersOrder(playersList)

        const len = gameState.playersOrder.length

        gameState.readerPlayer = idxReaderPlayer % len
        gameState.actualPlayer = (idxReaderPlayer + 1) % len

        localStorage.setItem("orderPlayers", JSON.stringify(gameState.playersOrder))
        localStorage.setItem("actualPlayer", JSON.stringify(gameState.actualPlayer))
        localStorage.setItem("readerPlayer", JSON.stringify(gameState.readerPlayer))

        hideMenu()
    }
})();