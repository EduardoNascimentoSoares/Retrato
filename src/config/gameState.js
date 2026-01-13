const gameFunctions = function () {
    window.gameState = {
        playersOrder: [],
        actualPlayer: 0,
        readerPlayer: 0,
        points: 10,

        questionsOrder: [],
        tipsOrder: [],
        revealedTips: [],
        traps: []
    }

    return gameState
}();