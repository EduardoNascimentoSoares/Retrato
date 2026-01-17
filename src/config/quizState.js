; (function () {
    window.getPlayers = function () {
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

    window.getQuestions = function () {
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

    window.shuffleQuestionsOrder = function () {
        const questionsOrder = Array.from(
            { length: window.questions.length },
            (_, i) => i)

        for (let i = questionsOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[questionsOrder[i], questionsOrder[j]] = [questionsOrder[j], questionsOrder[i]]
        }

        return questionsOrder
    }

    window.shuffleTipsOrder = function () {
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
})();
