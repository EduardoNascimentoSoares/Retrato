import { gameState } from "./state.js"
import { save, load } from "./storage.js"

export async function loadQuestions() {
  if (gameState.questionsJson.length) return

  const resp = await fetch("../_Perguntas/perguntas.json")
  gameState.questionsJson = await resp.json()
}

export function generateQuestionOrder() {
  let order = load("sorted")

  if (!order) {
    order = Array.from(
      { length: gameState.questionsJson.length },
      (_, i) => i
    ).sort(() => Math.random() - 0.5)

    save("sorted", order)
  }

  gameState.questionsOrder = order
  gameState.questionIndex = order[0]
}

export function getCurrentQuestion() {
  return gameState.questionsJson[gameState.questionIndex]
}

export function advanceQuestion() {
  gameState.questionsOrder.shift()
  save("sorted", gameState.questionsOrder)
}

export function generateTipOrder() {
  const saved = load("quizzState")

  if (saved?.tipOrder) {
    gameState.tipOrder = saved.tipOrder
    gameState.revealedTips = saved.revealedTips || []
    gameState.points = saved.points
    return
  }

  gameState.tipOrder = Array.from({ length: 10 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5)

  gameState.revealedTips = []
  persistQuizState()
}

export function persistQuizState() {
  save("quizzState", {
    tipOrder: gameState.tipOrder,
    revealedTips: gameState.revealedTips,
    points: gameState.points
  })
}

export function setPlayer() {
  const span = document.getElementById("jogador")
  span.textContent = gameState.actualPlayer
}

export function changePlayer() {
  if (gameState.actualPlayer < gameState.totalPlayers) {
    gameState.actualPlayer++
  } else {
    gameState.actualPlayer = 0
  }
  
  setPlayer()
}


export function generateTrapas() {
  // Perca Sua vez
  // Avance ou volte "x"
  // Escolha um jogador para avançar ou voltar "x"
}
