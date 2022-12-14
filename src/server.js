/* IMPORTACIÓN CLASES */
import { Contenedor } from "./classes/Contenedor.js";
import { Chat } from "./classes/Chat.js";
import { Cart } from "./classes/Cart.js";
import { Admin } from "./classes/Admin.js";

/* IMPORTACIÓN SERVIDORES */
import express from "express"
import {Server} from "socket.io"

/* IMPORTACIÓN OTROS MODULOS */
import exhbs from "express-handlebars";
import path from "path";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/* CONFIGURACION SERVIDOR */
const app = express();
const PORT = process.env.PORT || 8081;
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

/* LISTA DE PRODUCTOS PARA EL WEBSOCKET THE FORM */
//No puedo hacer que se actualice esta variable.
//Tengo que correr el server de nuevo para que se actualice
//Socket.io anda porque el chat con sqlite anda bien.
//Intente meterlo dentro del evento de connection pero me da error de conexion.
let productsArray = await products.getAll()

io.on("connection",(socket)=>{
    /* FUNCIONALIDAD DE VISTA DE PRODUCTOS CON WEBSOCKETS */
    io.sockets.emit("productListToClient", productsArray)

    /* FUNCIONALIDAD CHAT HECHO CON WEB SOCKETS */
    socket.on("message",async (data)=>{
        const messagesArray = await chat.addMessage(data)
        io.sockets.emit("messagesListToClient",messagesArray)
    })
})

/* RUTAS APLICACIÓN CON RENDERIZADO DEL MOTOR DE PLANTILLAS */

/* PLANTILLA FORMULARIO */
app.get("/",(req,res)=>{
    res.render("form")
})

/* PLANTILLA PRODUCTOS */
app.get("/productos",async (req,res)=>{
    if(await products.getAll().length == 0){
        res.render("products",{
            error:"Nothing Yet",
            image:'<img src="images/nothingList.svg" alt="nothing in the list">'
        })
    }else{
        res.render("products",{
            products:await products.getAll()
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

    if (cartSelectedArray.length != 0 && productSelectedArray.length != 0){
            cartSelectedProductsArray.push(productSelectedObj)
            res.send({success:`Product with id: ${idProduct} added to cart ${cartId}`}) 
    }else{

            res.send({error:"No product was selected. It may not exist. Check body of request is 'id':'number'"}) 
    }
})

cartRouter.delete("/:id/productos/:id_prod", async(req,res)=>{
    let cartId = parseInt(req.params.id);
    let productId = parseInt(req.params.id_prod);

    let cartObjArray = cart.getById(cartId)
    let cartObj = cartObjArray[0]
    let cartProductsArray = cartObj.products

    if (cartObjArray.length == 0){
        res.send({error:`Cart labeled with id ${cartId} does not exists.`})
    }else if(cartProductsArray.length == 0){
        res.send({error:`Product labeled with id ${productId} is not in cart ${cartId}.`})
    }else{
        Cart.CartList[cartId-1].products = cart.deleteProductInCart(productId,cartProductsArray);
        res.send({success:`Product labeled with id  ${productId} in cart ${cartId} deleted.`});
    }
})

/* RUTAS DE LA API DEL ROUTER DE PRODUCTOS  */
/* GET() TODOS LOS PRODUCTOS */
productsRouter.get("/",async (req,res)=>{
    res.send(await products.getAll())
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
productsRouter.post("/",async (req,res)=>{
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
    const productToUpdateArray = await products.getById(id);
    
    const doesProductToUpdateExists = (productToUpdateArray.length == 0)

    if (doesProductToUpdateExists){
        res.send({"error": "No hay producto para actualizar"});

    }else{
        if (editProductObject.name &&
            editProductObject.price &&
            editProductObject.thumbnail &&
            editProductObject.description &&
            editProductObject.code &&
            editProductObject.stock){

            products.update(editProductObject,id);
            res.send({success:`Product labeled with id ${id} updated.`});

        }else{
            res.send({error:"Some of the fields are empty or wrong."});

        }
    } 
})

/* DELETE() ELIMINAR PRODUCTO POR ID*/
productsRouter.delete("/:id",async (req,res)=>{
    const id = parseInt(req.params.id);
    const deleteProductObj = await products.getById(id)

    if (deleteProductObj.length == 0){
        res.send({error:`Product labeled with id ${id} does not exists.`})

    }else{
        await products.deleteById(id);
        res.send({success:`Product labeled with id  ${id} deleted.`});

    }
})

/* RUTA GENERICA QUE NO EXISTE */
app.get("*",(req,res)=>res.send({"error":"This path does not exists."}))