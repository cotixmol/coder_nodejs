console.log("Form.js funciona")
const socket = io();

let divProductListWSOuterContainer = document.getElementById("divProductListWSOuterContainer")

socket.on("productListToCliente",(data)=>{
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


