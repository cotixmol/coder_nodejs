console.log("Form.js funciona")

/* SERVIDOR WEB SOCKET */
const socket = io();

/* FUNCIONALIDAD DE VISTA DE PRODUCTOS CON WEBSOCKETS */

let divProductListWSOuterContainer = document.getElementById("divProductListWSOuterContainer")

socket.on("productListToClient",(data)=>{
    let productListTitleWS = "";
    let productListBlockWS = "";

        data.forEach(elm => {
            productListBlockWS +=   `<div id="divProductListWSContainer">
                                        <img class="productListBlockWSImage" src=${elm.thumbnail} alt="Producto"></img>
                                        <div class="productListBlockWSText">
                                            <p>${elm.name}</p>
                                            <p>$${elm.price}</p>
                                        </div>
                                    </div>`
        });
    
    (productListBlockWS!=="") ? productListTitleWS="<p class='productListTitleWS'>Added products</p>" : productListTitleWS="";
    divProductListWSOuterContainer.innerHTML= productListTitleWS + productListBlockWS
})

/* FUNCIONALIDAD CHAT HECHO CON WEB SOCKETS */

const chatForm = document.getElementById("chatForm")
const chatMessagesContainer = document.getElementById("chatMessagesContainer")

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = {
        date: new Date().toLocaleString(),
        user: document.getElementById("chatFormMail").value,
        text: document.getElementById("chatFormText").value,
    }

    socket.emit("message",message)

    document.getElementById("chatFormMail").value="";
    document.getElementById("chatFormText").value="";
})
    
socket.on("messagesListToClient",(data)=>{
    let chatMessagesBlock = ""
    data.forEach((elm)=>{
        chatMessagesBlock += `<div class="divChatMessagesBlockContainer">
                                <p class="chatDate">${elm.date}<p>
                                <p class="chatUser">${elm.user}</p>
                              </div>
                                <p class="chatText">${elm.text}</p>`

    })
    chatMessagesContainer.innerHTML = chatMessagesBlock

})




