/* FUNCIONALIDAD LISTA HECHA CON WEB SOCKETS */

console.log("Form.js funciona")
const socket = io();

let divProductListWSOuterContainer = document.getElementById("divProductListWSOuterContainer")

socket.on("productListToClient",(data)=>{
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
    
    let productListTitleWS = "";
    if (productListBlockWS!=="") {productListTitleWS="<p class='productListTitleWS'>Added products</p>"}
    divProductListWSOuterContainer.innerHTML= productListTitleWS + productListBlockWS
})

/* FUNCIONALIDAD CHAT HECHO CON WEB SOCKETS */



const chatForm = document.getElementById("chatForm")

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
    console.log(data)
})



// socket.on("chatClass",(chatClass)=>{
//     chatClass.addMessage(message)
// })
// socket.on("messagesListToClient",(data)=>{
//     console.log(data)
// })


