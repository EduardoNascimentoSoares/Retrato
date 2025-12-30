// - Fazer verificação das respostas (se ta correta, se foram todas as dicas, quantas casas pode andar)

const jogador = 0
const pontos = { valor: 10, jogador: 0 }

window.addEventListener("load", loadQuestions)

document.addEventListener("keydown", e => {
  if (e.key === "Enter") { isCorrect() }
})

const chute = document.querySelector("button#btnResp")
chute.addEventListener("click", isCorrect)

async function getQuestions() {
  const resp = await fetch("../_Perguntas/perguntas.json")
  const perguntas = await resp.json()
  let sortedJson = JSON.parse(localStorage.getItem("sorted"))

  if (!sortedJson) {
    const s = Array.from(
      { length: perguntas.length },
      (_, index) => index
    )

    s.sort(() => Math.random() - 0.5)

    localStorage.setItem("sorted", JSON.stringify(s))
    sortedJson = s
  }

  localStorage.setItem("indexQuest", JSON.stringify(sortedJson[0]))
  localStorage.setItem("json", JSON.stringify(perguntas))

  return perguntas[sortedJson[0]]
}

async function loadQuestions() {
  const quest = await getQuestions()
  const categoria = document.getElementById("categoria")
  const resposta = document.getElementById("resposta")

  categoria.textContent = quest["Categoria"]
  resposta.textContent = quest["Resposta"]
  updatePoints(true)

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  for (let i = 1; i <= 10; i++) {
    const dica = document.getElementById(`dica${i}`)
    if (!dica) continue

    const index = Math.floor(Math.random() * nums.length)
    const r = nums.splice(index, 1)[0]

    dica.textContent = quest[`Dica${r}`]
  }
}

function reveal(i) {
  i
}

function isCorrect() {
  const input = document.getElementById("chute")
  const kick = input.value.trim().toLowerCase()
  const i = JSON.parse(localStorage.getItem("indexQuest"))
  const json = JSON.parse(localStorage.getItem("json"))
  const resp = json[i]["Resposta"].toLowerCase().trim()

  let list = JSON.parse(localStorage.getItem("sorted"))

  input.value = " "

  if (kick === resp) {
    alert("acertooou")
    list.shift()
    localStorage.setItem("sorted", JSON.stringify(list))

    location.href = "../pages/tabuleiro.html"
    return
  }

  if (pontos["valor"] === 1) {
    list.shift()
    localStorage.setItem("sorted", JSON.stringify(list))
    gameOver()
    return
  }

  alert("Errou hahaha")
  updatePoints()
  console.log(pontos);
}

function updatePoints(i = false) {
  let pointText = document.querySelector("p#tabelaPontos")
  if (!i) {
    pontos["valor"] -= 1
  }
  pointText.textContent = pontos["valor"]
}

function gameOver() {
  alert("perdeu a vez")
  location.href = "../pages/tabuleiro.html"
}

const spans = document.querySelectorAll("span")
spans.forEach(span => {
  span.addEventListener("click", () => {
    span.classList.remove("oculto")

    updatePoints()

    if (pontos["valor"] === 0) gameOver()
  }, { once: true });
});

const resposta = document.querySelector("p#resposta")
resposta.addEventListener("click", r => {
  r.currentTarget.classList.remove("oculto")

  let list = JSON.parse(localStorage.getItem("sorted"))
  list.shift()
  localStorage.setItem("sorted", JSON.stringify(list))
  
  gameOver()

  alert(`A resposta era ${resposta.textContent}`)
})