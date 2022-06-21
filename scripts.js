let name = prompt("Digite o seu nome?")
const container = document.querySelector(".container")
let varies

if (name === "Claudio") {
    console.log("Servidor aprovou")
    container.innerHTML += `
    <div class="on-off">
        <div class="time">(09:21:45)</div>
        <h4><strong>${name}</strong> entrou na sala...</h4>
    </div>
    `
    varies = true
}

function sendMessage () {

    if (varies === true) {
        let valueMessage = document.querySelector("input").value
        container.innerHTML += `
        <div class="user-messenger">
            <div class="time">(09:21:45)</div>
            <h4><strong>${name}</strong> para <strong>Todos</strong>: ${valueMessage}</h4>
        </div>
        `
        document.querySelector("input").value = ''
    }
}
