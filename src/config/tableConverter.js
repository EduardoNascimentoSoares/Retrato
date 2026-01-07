const input = document.getElementById("inputFile");
const btn = document.getElementById("btnSend");
const output = document.getElementById("output");
const dropZone = document.getElementById("dropZone");
const fileNameDisplay = document.getElementById("fileName");

// Drag and Drop functionality
dropZone.addEventListener('click', () => input.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-active');

    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        updateUI(file.name);
    }
});

input.addEventListener('change', () => {
    if (input.files.length) {
        updateUI(input.files[0].name);
    }
});

function updateUI(name) {
    fileNameDisplay.textContent = `Arquivo: ${name}`;
    output.textContent = "";
}


// Logic to convert CSV to JSON and download
btn.addEventListener("click", insertCsv)

function insertCsv() {
    const csv = input.files[0]
    output.textContent = ''
    if (!csv) {
        output.textContent = "Nenhum arquivo encontrado"
        return
    }

    const reader = new FileReader()

    reader.onload = () => {
        try {
            const table = convertInJson(reader.result)
            saveNewJson(table)
        } catch (error) {
            console.error("Erro ao processar CSV:", error)
            output.textContent = "Erro ao processar o CSV."
        }
    }

    reader.onerror = () => {
        output.textContent = "Erro ao ler o arquivo."
    }

    reader.readAsText(csv)
}

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

function saveNewJson(obj) {
    const content =
        `const questions = ${JSON.stringify(obj, null, 2)};`

    const jsFile = new Blob(
        [content],
        { type: "text/javascript" }
    )

    const url = URL.createObjectURL(jsFile)
    const a = document.createElement("a")
    a.href = url
    a.download = "perguntas.js"
    a.click()

    URL.revokeObjectURL(url)
}
