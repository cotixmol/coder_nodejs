const {Contenedor,Chat} = require("./class")
const exhbs = require("express-handlebars")
const path = require("path")

/* CONFIGURACION SERVIDOR */
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT,()=>console.log(`Servidor ON en puerto ${PORT}`));
app.use(express.static("public"));
/* CONFIGURACIÓN WEBSOCKETS */
const { Server } = require("socket.io");
const io = new Server(server)
/* CONFIGURACIÓN PARA QUE FUNCIONE FORMULARIO Y JSON */
app.use(express.urlencoded({extended:true}));
app.use(express.json());
/* CONFIGURACIÓN ROUTER */
const productsRouter = express.Router();
app.use("/api/productos",productsRouter)
/* CONFIGURACIÓN HANDLEBARS */
app.engine("handlebars",exhbs.engine({defaultLayout:"main"}))
const viewFolder = path.join(__dirname,"views")
app.set("views",viewFolder)
app.set("view engine", "handlebars")

/* -------------------------------------------------------------------- */

/* INSTANCIACIÓN DE CLASE DE PRODUCTOS */
let products = new Contenedor;

/* ARRAYS CON VARIABLES ESTATICAS DE LA CLASE */
let productList= Contenedor.productsList;
let messagesList = Chat.messagesList;

/* WEBSOCKET SETUP */
let productsListWS=[]

io.on("connection",(socket)=>{
    io.sockets.emit("productListToClient",productList)
    io.sockets.emit("messagesListToClient",messagesList)
    socket.on("productsListToServer",(data)=>{
        productsListWS.push(data)
    })
})

/* RUTAS DEL TEMPLATE CON RENDER DE VARIABLES */
//Template del formulario
app.get("/",(req,res)=>{
    res.render("form",{
        products:productsListWS
    })
})
//Template de los productos
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

/* RUTAS DE LA API */
//Api con todos los productos.
productsRouter.get("/",(req,res)=>{
    res.send(products.getAll())
})
//Api con el producto por id.
productsRouter.get("/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    product = products.getById(id);
    product == false ? res.send({"error": "No hay producto"}) : res.send(product);
})
//Api con el envio del formulario
productsRouter.post("/",(req,res)=>{
    const productObject = req.body;
    if (productObject.name && productObject.price && productObject.thumbnail){
        products.save(productObject);
        res.redirect("/")
    }else{
        res.send({error:"faltan campos o estan erroneos (name, price, thumbnail)"})
    }
})
//Api para el reemplazo de productos por id.
productsRouter.put("/:id", async (req,res)=>{
    const id = parseInt(req.params.id);
    const productObject = req.body;

    if (products.getById(id) == false){
        res.send({"error": "No hay producto para actualizar"})
    }else{
        if (productObject.name && productObject.price && productObject.thumbnail){
            await products.deleteById(id);
            products.update(productObject,id);
            products.sort()
            res.send({"exito":`Producto con id ${id} actualizado`});
        }else{
            res.send({"error":"faltan campos o estan erroneos (name, price, thumbnail)"})
        }
    } 
})
//Api para borrar productos por id.
productsRouter.delete("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const productObj = products.getById(id)
    if (productObj == false){
        res.send({"error":`Producto con id ${id} no existe`})
    }else{
        products.deleteById(id);
        res.send({"exito":`Producto con id ${id} eliminado`});
    }
})

/* RUTA DE NO EXIsTE */
app.get("*",(req,res)=>res.send({"error":"No existe la ruta"}))