const gameFunctions = function () {
    window.gameState = {
        playersOrder: [],
        actualPlayer: 0,
        readerPlayer: 0,
        points: 10,
        movementPlayer: 0,
        movementReader: 0,

        questionsOrder: [],
        tipsOrder: [],
        revealedTips: []
    }

    return gameState
}();