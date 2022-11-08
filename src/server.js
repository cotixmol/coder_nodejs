const Contenedor = require("./class")
const handlebars = require("express-handlebars")
const path = require("path")

/* CONFIGURACION SERVIDOR */
const express = require("express");
const app = express();
const PORT = 8080;
app.listen(PORT,()=>console.log(`Servidor ON. Puerto ${PORT}`))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static("public"));

/* CONFIGURACIÓN ROUTER */
const productsRouter = express.Router();
app.use("/api/productos",productsRouter)

/* CONFIGURACIÓN HANDLEBARS */
app.engine("handlebars",handlebars.engine())

const viewFolder = path.join(__dirname,"views")
app.set("views",viewFolder)

app.set("view engine", "handlebars")

/* FUNCIONALIDAD SERVIDOR */
let products = new Contenedor;

/* RUTAS SERVIDOR */
app.get("/",(req,res)=>{
    res.render("form")
})
productsRouter.get("/",(req,res)=>{
    res.send(products.getAll())
})
productsRouter.get("/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    product = products.getById(id);
    product == false ? res.send({"error": "No hay producto"}) : res.send(product);
})
productsRouter.post("/",(req,res)=>{
    const productObject = req.body;
    if (productObject.name && productObject.price && productObject.thumbnail){
        products.save(productObject);
        res.send({"exito":"producto agregado"})
    }else{
        res.send({"error":"faltan campos o estan erroneos (name, price, thumbnail)"})
    }
})
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


/* RUTA DE CONTROL */
app.get("*",(req,res)=>res.send({"error":"No existe la ruta"}))