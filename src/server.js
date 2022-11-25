/* IMPORTACIÓN CLASES */
const {Contenedor} = require("./classes/Contenedor")
const {Chat} = require("./classes/Chat")
const {Cart} = require("./classes/Cart")
const {Admin} = require("./classes/Admin")

/* IMPORTACIÓN SERVIDORES */
const express = require("express");
const { Server } = require("socket.io");
/* IMPORTACIÓN OTROS MODULOS */
const exhbs = require("express-handlebars")
const path = require("path")

/* CONFIGURACION SERVIDOR */
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT,()=>console.log(`Servidor ON en puerto ${PORT}`));

/* CARPETA ARCHIVOS ESTATICOS */
app.use(express.static("public"));

/* CONFIGURACIÓN WEBSOCKETS */
const io = new Server(server)

/* CONFIGURACIÓN CORRER FORMS Y JSON */
app.use(express.urlencoded({extended:true}));
app.use(express.json());

/* CONFIGURACIÓN ROUTERS */
const productsRouter = express.Router();
const cartRouter = express.Router();
app.use("/api/productos",productsRouter)
app.use("/api/carrito",cartRouter)

/* CONFIGURACIÓN TEMPLATE ENGINE Y HANDLEBARS */
app.engine("handlebars",exhbs.engine({defaultLayout:"main"}))
const viewFolder = path.join(__dirname,"views")
app.set("views",viewFolder)
app.set("view engine", "handlebars")

/* -------------------------------------------------------------------- */

/* INSTANCIACIÓN DE CLASES */
let products = new Contenedor;
const chat = new Chat;
const cart = new Cart;

/* ARRAYS CON VARIABLES ESTATICAS DE LA CLASE */
let productList= Contenedor.productsList;

io.on("connection",(socket)=>{
    /* FUNCIONALIDAD DE VISTA DE PRODUCTOS CON WEBSOCKETS */
    io.sockets.emit("productListToClient",productList)

    /* FUNCIONALIDAD CHAT HECHO CON WEB SOCKETS */
    socket.on("message",(data)=>{
        chat.addMessage(data)
        io.sockets.emit("messagesListToClient",Chat.messagesList)
    })
})

/* RUTAS APLICACIÓN CON RENDERIZADO DEL MOTOR DE PLANTILLAS */

/* PLANTILLA FORMULARIO */
app.get("/",(req,res)=>{
    res.render("form")
})

/* PLANTILLA PRODUCTOS */
app.get("/productos",async (req,res)=>{
    if(await productList==false){
        res.render("products",{
            error:"Nothing Yet",
            image:'<img src="images/nothingList.svg" alt="nothing in the list">'
        })
    }else{
        res.render("products",{
            products:productList
        })
    }
})

/* RUTAS DE LA API DEL ROUTER DE CARRITO  */

/* POST() NUEVO PRODUCTO */
cartRouter.post("/",async (req,res)=>{
    await cart.createCart();
    res.send({success:`Cart labeled with id: ${Cart.id} added.`})
})

cartRouter.delete("/:id",async (req,res)=>{
    let id = parseInt(req.params.id);
    let deletedCart = await cart.getById(id);

    if (deletedCart.length != 0){
        await cart.deleteCartById(id)
        res.send({success:`Cart labeled with id: ${id} deleted.`})
    }else{
        res.send({error:`Cart labeled with id: ${id} does not exists.`})  
    }
})

cartRouter.get("/:id/productos",async(req,res)=>{
    let id = parseInt(req.params.id);
    let cartSelectedArray = await cart.getById(id);
    let cartSelectedObject = cartSelectedArray[0]

    console.log(cartSelectedObject.products)

    if (cartSelectedArray.length != 0){
        res.send({"Cart":`${id}`,
                  "Products added in cart": cartSelectedObject.products})
    }else{
        res.send({error:`Cart labeled with id: ${id} does not exists.`})  
    }
})

cartRouter.post("/:id/productos", async(req,res)=>{
    let cartId = parseInt(req.params.id);
    let cartSelectedArray = cart.getById(cartId)
    let cartSelectedObj = cartSelectedArray[0]
    let cartSelectedProductsArray = cartSelectedObj.products

    let idProduct = parseInt(req.body.id);
    let productSelectedArray = products.getById(idProduct)
    let productSelectedObj = productSelectedArray[0]

    if (cartSelectedArray.length != 0 &&
        productSelectedArray.length != 0 &&
        cartId == true &&
        idProduct == true){
            cartSelectedProductsArray.push({...productSelectedObj})
            res.send({success:`Product with id: ${idProduct} added to cart ${cartId}`}) 
    }else{

            res.send({error:"No product was selected. It may not exist. Check body of request is 'id':'number'"}) 
    }
})

/* RUTAS DE LA API DEL ROUTER DE PRODUCTOS  */
/* GET() TODOS LOS PRODUCTOS */
productsRouter.get("/",(req,res)=>{
    res.send(products.getAll())
})

/* GET() PRODUCTO DADO UN ID */
productsRouter.get("/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    product = products.getById(id);

    product == false ? 
    res.send({"error": "Product does not exist"}) :
    res.send(product);
})

/* POST() NUEVO PRODUCTO */
productsRouter.post("/",(req,res)=>{
    const newProductObject = req.body;

    if (newProductObject.name &&
        newProductObject.price &&
        newProductObject.thumbnail &&
        newProductObject.description &&
        newProductObject.code &&
        newProductObject.stock){

        products.save(newProductObject);
        res.redirect("/");

    }else{
        res.send({error:"Some of the fields are empty or wrong"})

    }
})

/* PUT() EDITAR PRODUCTO POR ID */
productsRouter.put("/:id", async (req,res)=>{
    const id = parseInt(req.params.id);
    const editProductObject = req.body;

    if (products.getById(id) == false){
        res.send({"error": "No hay producto para actualizar"});

    }else{
        if (editProductObject.name &&
            editProductObject.price &&
            editProductObject.thumbnail){

            await products.deleteById(id);
            products.update(productObject,id);
            products.sort();
            res.send({success:`Product labeled with id ${id} updated.`});

        }else{
            res.send({error:"Some of the fields are empty or wrong."});

        }
    } 
})

/* DELETE() ELIMINAR PRODUCTO POR ID*/
productsRouter.delete("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const deleteProductObj = products.getById(id)
    if (deleteProductObj == false){
        res.send({error:`Product labeled with id ${id} does not exists.`})

    }else{
        products.deleteById(id);
        res.send({success:`Product labeled with id  ${id} deleted.`});

    }
})

/* RUTA GENERICA QUE NO EXISTE */
app.get("*",(req,res)=>res.send({"error":"This path does not exists."}))