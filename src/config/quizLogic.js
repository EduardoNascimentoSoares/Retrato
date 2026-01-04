import { gameState } from "./state.js"
import {
  loadQuestions,
  generateQuestionOrder,
  getCurrentQuestion,
  advanceQuestion,
  generateTipOrder,
  changePlayer,
  setPlayer
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

import { clear } from "./storage.js"

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

  setPlayer()

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
    updatePointsUI()
    return
  } else {
      changePlayer()
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

      const question = getCurrentQuestion()

      if (gameState.points === 0) {
        showMessage(`A resposta era ${question.Resposta}`)
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
