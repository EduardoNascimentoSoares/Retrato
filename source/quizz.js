// - Arrumar a pasta óbvia pro Fafa
// - Evitar que a mesma pergunta possa aparecer mais de uma vez (provavelmente vai ter q usar localstorage)
// - Fazer verificação das respostas (se ta correta, se foram todas as dicas, quantas casas pode andar)
// - Impedir que uma dica volte a ser oculta

window.addEventListener("load", async () => {
    const resp = await fetch("../source/perguntas.json")
    const perguntas = await resp.json()

    const indexQuest = Math.floor(Math.random() * (perguntas.length))

    let quest = perguntas[indexQuest]

    const categoria = document.getElementById("categoria")
    const resposta = document.getElementById("resposta")
    categoria.textContent = quest["Categoria"]
    resposta.textContent = quest["Resposta"]
    
    const nums = [1,2,3,4,5,6,7,8,9,10]
    for(let i = 1; i <= 10; i++){
        const dica = document.getElementById(`dica${i}`)
        if(!dica) continue

        const index = Math.floor(Math.random() * nums.length)
        const r = nums.splice(index, 1)[0]

        dica.textContent = quest[`Dica${r}`]
    }
})

const spans = document.querySelectorAll("span")

  spans.forEach(span => {
    span.addEventListener("click", () => {
      span.classList.toggle("oculto");
    });
  });