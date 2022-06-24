let name
let userName
let varies = 0
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
    console.log(resposta.data)
    for (let i = 0; i < (resposta.data).length; i++) {
        console.log(resposta.data[i].name)
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

    setTimeout(function () { //dar um tempo so pra enganar e ficar rodando o loading

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
            let statusCode = code.response.status
            console.log(statusCode)
    })
    }, 0) //adicionar tempo aqui
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
setInterval(searchMessagesFromServer, 3000) //Atualizando mensagens


function messagesFromServer (answerServer) {

    messagesData = answerServer.data
    container.innerHTML = ""
    console.log("atualizando mensagens")

    for (let i = 0; i < messagesData.length; i++) {

        if (messagesData[i].type == "status") {
            container.innerHTML += `
            <div class="on-off">
                <div class="time">(${messagesData[i].time})</div>
                <h4><strong>${messagesData[i].from}</strong> ${messagesData[i].text}</h4>
            </div>
            `
        } 

        else if (messagesData[i].type == "message") {
            container.innerHTML += `
            <div class="user-messenger">
                <div class="time">(${messagesData[i].time})</div>
                <h4><strong>${messagesData[i].from}</strong> para <strong>${messagesData[i].to}</strong>: ${messagesData[i].text}</h4>
            </div>
            `
        }
    }
}


//Enviando mensagem para o servidor
function sendMessage () {

    let valueMessage = document.querySelector(".footer textarea").value

    messageFromUser = {
        from: userName.name,
        to: "Todos",
        text: valueMessage,
        type: "message"
    }

    console.log(messageFromUser)

    axios.post(urlServerMessages, messageFromUser)
    .then(() => {
        console.log("mensagem enviada")
        //messagesFromServer ()
        searchMessagesFromServer ()
    })
    .catch(() => {
        console.log("mensagem negada")
    })

    document.querySelector(".footer textarea").value = ""
    /*verificar se esta correto 
    const elementView = document.querySelector('.user-messenger');
    elementView.scrollIntoView();*/
    
}

//Menu lateral com alguns bugs
function openSideMenu () {

    const elementSideMenu = document.querySelector(".side-menu")
    elementSideMenu.classList.add("properties-sideMenu")
    //document.querySelector(".top").classList.add("properties-top")
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
        elementSideMenu.classList.remove("properties-sideMenu")
        //document.querySelector(".top").classList.remove("properties-top")
        document.querySelector("body").classList.remove("properties-body")
        document.querySelector(".container").classList.remove("properties-container")
        console.log("fechei menu lateral")
    }
}


function searchParticipants () {
    const promise = axios.get(urlServerParticipants)
    promise.then(listPartipantsOnline)
}


function listPartipantsOnline (answerServerParticipants) {
    participantsData = answerServerParticipants.data
    const contacts = document.querySelector(".contacts")
    contacts.innerHTML = ""
    console.log("atualizando mensagens")

    contacts.innerHTML = `
    <div class="contact" onclick = "selectParticipants()">
        <img src="img/Vector.png" alt="" class="img-person">
        <p>Todos</p>
    </div>
    `

    for (let i = 0; i < participantsData.length; i++) {

        contacts.innerHTML += `
        <div class="contact" onclick="SelectParticipants()">
            <img src="img/face.png" alt="" class="img-person">
            <p>${participantsData[i].name}</p>
        </div>
        `
    }
}


function selectParticipants () {
    console.log("selecionou")
}

