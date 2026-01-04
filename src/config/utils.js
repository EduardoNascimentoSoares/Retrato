import { gameState } from "./state.js"
import { persistQuizState } from "./questions.js"

export function normalize(text) {
  return text.trim().toLowerCase()
}

export function checkAnswer(kick, answer) {
  return normalize(kick) === normalize(answer)
}

export function losePoint() {
  gameState.points--
  persistQuizState()
}

export function resetPoints() {
  gameState.points = 10
}
