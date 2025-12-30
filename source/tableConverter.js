const input = document.getElementById("inputFile")
const btn = document.getElementById("btnSend")
const output = document.getElementById("output")

btn.addEventListener("click", async () => {
    if (input.files.length === 0) {
        output.textContent = "Nenhum arquivo encontrado."
        return;
    }

    try {
        const csv = await input.files[0].text()

        const table = convertInJson(csv)
        saveNewJson(table)

    } catch (error) {
        output.textContent = "Erro ao ler o arquivo."
    }
})


function convertInJson(csv) {
    const lines = csv.trim().split("\n")
    const columns = lines[0].split(";")

    const data = lines.slice(1)

    const result = data.map(lines => {
        const values = lines.split(";")
        const obj = {};

        columns.forEach((columns, index) => {
            obj[columns.trim()] = values[index]?.trim()
        })

        return obj
    })

    return result
}

async function saveNewJson(table) {
    const resp = await fetch("../source/perguntas.json")
    let jsonData = await resp.json()

    jsonData = table;

    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "perguntas.json",
        types: [
            {
                description: "Arquivo JSON",
                accept: { "application/json": [".json"] }
            }
        ]
    });

    const writable = await fileHandle.createWritable();
    await writable.write(
        JSON.stringify(jsonData, null, 2)
    );
    await writable.close();
}