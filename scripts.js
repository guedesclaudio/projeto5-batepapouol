let name
let userName
let varies = 0
const urlServerMessages = "https://mock-api.driven.com.br/api/v6/uol/messages"
const urlServerParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants"
const urlServerStatus = "https://mock-api.driven.com.br/api/v6/uol/status"
const container = document.querySelector(".container")


function sendUserNameToServer () {
    name = document.querySelector(".login input").value
    userName = { name: name };
    document.querySelector(".loading").classList.remove("hidden")
    document.querySelector(".login h4").classList.remove("hidden")

    setTimeout(function () {

        const promise = axios.post(urlServerParticipants, userName)
        promise.then((code) => {

            console.log("usuario aceito")
            console.log(code.status)
            searchMessagesFromServer ()
            document.querySelector(".login").classList.add("hidden")
            document.querySelector("body").classList.remove("color-body")
            document.querySelector(".page").classList.remove("hidden")
            
    })
        promise.catch((code) => {
        
            console.log("usuario negado")
            let statusCode = code.response.status
            console.log(statusCode)
            sendUserNameToServer()
        
    })
    }, 3000)
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
setInterval(updateUser, 5000) //Atualizando usuario
 

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

    let valueMessage = document.querySelector(".footer input").value

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
        messagesFromServer ()
    })
    .catch(() => {
        console.log("mensagem negada")
    })


    /*verificar se esta correto 
    const elementView = document.querySelector('.user-messenger');
    elementView.scrollIntoView();*/
    
}
