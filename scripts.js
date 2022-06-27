let name
let userName
let varies = 0
let participant = "Todos"
let visibility 
let typeMsg = "message"
const urlServerMessages = "https://mock-api.driven.com.br/api/v6/uol/messages"
const urlServerParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants"
const urlServerStatus = "https://mock-api.driven.com.br/api/v6/uol/status"
const container = document.querySelector(".container")


//Inicio de tudo
function begin () {
    name = document.querySelector(".login input").value
    userName = { name: name };

    const promiseOnline = axios.get(urlServerParticipants)
    promiseOnline.then(listParticipants)
}

//Testa se o nome enviado ja existe no servidor
function listParticipants (resposta) {
    for (let i = 0; i < (resposta.data).length; i++) {
        if (name === resposta.data[i].name) {
            alert("Esse nome está em uso, digite outro")
            return
        }
    }
    sendUserNameToServer()
}



function sendUserNameToServer () {
    
    document.querySelector(".loading").classList.remove("hidden")
    document.querySelector(".login h4").classList.remove("hidden")

    setTimeout(function () { 

        const promise = axios.post(urlServerParticipants, userName)
        promise.then((code) => {
            console.log("usuario aceito")
            console.log(code.status)
            searchMessagesFromServer ()
            setInterval(updateUser, 5000) //Atualizando usuario
            document.querySelector(".login").classList.add("hidden")
            document.querySelector("body").classList.remove("color-body")
            document.querySelector(".page").classList.remove("hidden")
            
    })
        promise.catch((code) => {
            console.log("usuario negado")
            alert("Digite um nome válido")
            window.location.reload()
            let statusCode = code.response.status
            console.log(statusCode)
    })
    }, 1500) 
}


function updateUser () {
    const promise = axios.post(urlServerStatus, userName)
    promise.then(() => {
        console.log("usuario esta conectado")
        errorUserName = false
    })
    promise.catch(() => {
        errorUserName = true
        console.log("usuario foi desconectado")
    })
}

 
function searchMessagesFromServer () {
    const promise = axios.get(urlServerMessages)
    promise.then(messagesFromServer)
}
setInterval(searchMessagesFromServer, 3000) 


function messagesFromServer (answerServer) {

    let numberMessage = 0
    messagesData = answerServer.data
    container.innerHTML = ""
    console.log("atualizando mensagens")

    for (let i = 0; i < messagesData.length; i++) {
        numberMessage += 1
        if (messagesData[i].type == "status") {
            container.innerHTML += `
            <div class="on-off msg${numberMessage}">
                <div class="time">(${messagesData[i].time})</div>
                <div class = "msg">
                    <h4><strong>${messagesData[i].from}</strong> ${messagesData[i].text}</h4>
                </div>
            </div>
            `
        } 

        else if (messagesData[i].type == "message") {
            container.innerHTML += `
            <div class="user-messenger msg${numberMessage}">
                <div class="time">(${messagesData[i].time})</div>
                <div class="msg">
                    <h4>
                        <strong>${messagesData[i].from}</strong> para <strong>${messagesData[i].to}</strong>: ${messagesData[i].text}
                    </h4>
                </div>
            </div>
            `
        }
        else if (messagesData[i].type == "private_message" && (messagesData[i].to === name || messagesData[i].from === name)) {
            container.innerHTML += `
            <div class="direct-messenger msg${numberMessage}">
                <div class="time">(${messagesData[i].time})</div>
                <div class="msg">
                    <h4>
                        <strong>${messagesData[i].from}</strong> para <strong>${messagesData[i].to}</strong>: ${messagesData[i].text}
                    </h4>
                </div>
            </div>
            `
        }
    }
    const elementView = document.querySelector('.msg99');
    elementView.scrollIntoView();
}


//Enviando mensagem para o servidor
function sendMessage () {

    let valueMessage = document.querySelector(".footer textarea").value

    if (visibility === "Público") {
        typeMsg = "message"
    }
    else if (visibility == "Reservadamente") {
        typeMsg = "private_message"
    }

    messageFromUser = {
        from: userName.name,
        to: participant,
        text: valueMessage,
        type: typeMsg
    }

    const promise = axios.post(urlServerMessages, messageFromUser)
    promise.then(() => {
        console.log("mensagem enviada")
        //messagesFromServer ()
        searchMessagesFromServer ()
    })
    promise.catch(() => {
        console.log("mensagem negada")
        alert("Não foi possível enviar a mensagem, entre novamente na sala")
        window.location.reload()
    })

    document.querySelector(".footer textarea").value = ""
    
    
}

//Ta funcionando mas ta zoando a caixa de mensagem
/*
document.addEventListener('keydown', function(e) {
    if(e.key == "Enter"){
      document.querySelector(".footer img").click();
      
    }
});
*/


function openSideMenu () {
    const elementSideMenu = document.querySelector(".side-menu")
    elementSideMenu.classList.add("properties-sideMenu")
    document.querySelector(".black-screen").classList.remove("hidden")
    document.querySelector("body").classList.add("properties-body")
    document.querySelector(".container").classList.add("properties-container")
    elementSideMenu.classList.remove("hidden")
    console.log("abriu menu lateral")
    searchParticipants()
}


function offSideMenu () {
    const elementSideMenu = document.querySelector(".side-menu")

    if (elementSideMenu.classList.contains("hidden")){
        console.log("menu lateral nao ta aberto")
    }
    else {
        elementSideMenu.classList.add("hidden")
        document.querySelector(".black-screen").classList.add("hidden")
        elementSideMenu.classList.remove("properties-sideMenu")
        document.querySelector("body").classList.remove("properties-body")
        document.querySelector(".container").classList.remove("properties-container")
        console.log("fechei menu lateral")
    }
}

function searchParticipants () {
    const promise = axios.get(urlServerParticipants)
    promise.then(listPartipantsOnline)
}
setInterval(searchParticipants, 10000)

function listPartipantsOnline (answerServerParticipants) {
    participantsData = answerServerParticipants.data
    const contacts = document.querySelector(".contacts")
    contacts.innerHTML = ""
    console.log("atualizando participantes")

    contacts.innerHTML = `
    <div class="contact" onclick = "selectParticipants(this)">
        <div>
            <img src="img/Vector.png" alt="" class="img-person">
            <p>Todos</p>
        </div>
        <img src="img/select.png" class = "img-select hidden">
    </div>
    `

    for (let i = 0; i < participantsData.length; i++) {

        contacts.innerHTML += `
        <div class="contact" onclick="selectParticipants(this)">
            <div class="participant">
                <img src="img/face.png" alt="" class="img-person">
                <p>${participantsData[i].name}</p>
            </div>
            <img src="img/select.png" class = "img-select hidden">
        </div>
        `
    }
}

function selectParticipants (element) {
    
    const elementClicked = document.querySelector(".clicked")

    if (elementClicked !== null) {
        elementClicked.classList.remove("clicked")
        elementClicked.querySelector(".img-select").classList.add("hidden")
    }

    element.classList.add("clicked")
    element.querySelector(".img-select").classList.remove("hidden")

    participant = element.querySelector("p").innerHTML
    
    if (visibility == undefined) {visibility = "Público"}

    document.querySelector(".footer p").innerHTML = `Enviando para ${participant} (${visibility})`
    return participant
}

function selectVisibility(element) {

    const elementClicked = document.querySelector(".clicked-visible")

    if (elementClicked !== null) {
        elementClicked.classList.remove("clicked-visible")
        elementClicked.querySelector(".img-select-visible").classList.add("hidden")
    }

    element.classList.add("clicked-visible")
    element.querySelector(".img-select-visible").classList.remove("hidden")

    visibility = element.querySelector("p").innerHTML
    document.querySelector(".footer p").innerHTML = `Enviando para ${participant} (${visibility})`
    return visibility
}