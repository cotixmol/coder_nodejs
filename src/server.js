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

/* FUNCIONALIDAD SERVIDOR */
class Contenedor{

    static id=0;
    static productsList = [];
    constructor(){
    }

    save(product){
        try{
            Contenedor.id++
            Contenedor.productsList.push({id:Contenedor.id,...product})
        }catch{
            return Error("Error en Contenedor.save(object)")
        }
    }

    update(product,id){
        try{
            Contenedor.productsList.push({id:id,...product})
        }catch{
            return Error("Error en Contenedor.update(product,id)")
        }
    }

    sort(){
        Contenedor.productsList.sort((a,b)=>{
            if(a.id>b.id){
                return 1
            }
            if(a.id<b.id){
                return -1
            }
        })
    }

    getById(id){
        try{
            const productObj = Contenedor.productsList.filter(elm=>elm.id==id)
            return productObj
        }catch{
            return Error("Error en Contenedor.getById(id)")
        }
    }

    getAll(){
        try{
            return Contenedor.productsList;
        }catch{
            return Error("Error in Contenedor.getAll()")
        }
    }

    deleteById(id){
        try{
            const productsArrayDeletedId = Contenedor.productsList.filter((elm)=>elm.id != id)
            Contenedor.productsList = productsArrayDeletedId;
        }catch{
            return Error("Error en Contenedor.deleteById(id)")
        }
    }

    deleteAll(){
        Contenedor.productsList = [];
    }
}

let products = new Contenedor;

/* RUTAS SERVIDOR */
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