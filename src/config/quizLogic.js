import { gameState } from "./state.js"
import {
  loadQuestions,
  generateQuestionOrder,
  getCurrentQuestion,
  advanceQuestion,
  generateTipOrder
} from "./questions.js"

import {
  checkAnswer,
  losePoint,
  resetPoints
} from "./utils.js"

import {
  renderQuestion,
  renderTips,
  updatePointsUI,
  reveal,
  showMessage,
  redirectboard
} from "./ui.js"

window.addEventListener("load", init)

document.addEventListener("keydown", e => {
  if (e.key === "Enter") handleAnswer()
})

document.getElementById("btnResp")
  .addEventListener("click", handleAnswer)

async function init() {
  resetPoints()
  await loadQuestions()
  generateQuestionOrder()
  generateTipOrder()

  const question = getCurrentQuestion()
  renderQuestion(question)
  renderTips(question)
  updatePointsUI()

  bindTips()
  bindRevealAnswer()
}

function handleAnswer() {
  const input = document.getElementById("chute")
  const kick = input.value
  input.value = ""

  const question = getCurrentQuestion()

  if (checkAnswer(kick, question.Resposta)) {
    showMessage("Acertou!")
    endRound()
    return
  }

  losePoint()
  updatePointsUI()

  if (gameState.pontos === 0) {
    showMessage("Perdeu a vez!")
    endRound()
  } else {
    showMessage("Errou 😅")
  }
}

function bindTips() {
  document.querySelectorAll("#dicas span").forEach((span, index) => {
    span.addEventListener("click", () => {
      if (gameState.revealedTips.includes(index)) return

      reveal(span)
      gameState.revealedTips.push(index)
      losePoint()
      updatePointsUI()

      if (gameState.pontos === 0) {
        showMessage("Perdeu a vez!")
        endRound()
      }
    }, { once: true })
  })
}

function bindRevealAnswer() {
  const resposta = document.getElementById("resposta")

  resposta.addEventListener("click", () => {
    reveal(resposta)
    showMessage(`A resposta era ${resposta.textContent}`)
    endRound()
  })
}

function endRound() {
  clear("quizzState")
  advanceQuestion()
  redirectboard()
}
