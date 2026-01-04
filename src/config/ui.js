import { gameState } from "./state.js"

export function renderQuestion(question) {
  document.getElementById("categoria").textContent = question.Categoria
  document.getElementById("resposta").textContent = question.Resposta
}

export function renderTips(question) {
  gameState.tipOrder.forEach((tipNum, i) => {
    const span = document.getElementById(`dica${i + 1}`)
    span.textContent = question[`Dica${tipNum}`]

    if (gameState.revealedTips.includes(i)) {
      span.classList.remove("oculto")
    }
  })
}

export function updatePointsUI() {
  document.getElementById("tabelapoints").textContent = gameState.points
}

export function reveal(el) {
  el.classList.remove("oculto")
}

export function showMessage(msg) {
  alert(msg)
}

export function redirectboard() {
  location.href = "../pages/board.html"
}
