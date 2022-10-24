//Importamos express y asignamos el servidor a la variable "app".
const express = require("express")
const app = express();
//Levantamos el servidor en el puerto 8080
app.listen(8080,()=>console.log("Servidor ON"))

//Importo la clase y la instancio en la variable productos
const classes = require("./classes")
let productos = new classes.Contenedor("productos")


//Generamos las rutas
app.get("/productos", async (req,res)=>{
    const allProducts = await productos.getAll();

    res.send(allProducts);
});

app.get("/productoRandom", async (req,res)=>{
    const allProducts = await productos.getAll();
    let lenProducts = allProducts.length;
    let randomNumber = Math.ceil(Math.random() * lenProducts);
    const randomProduct = await productos.getById(randomNumber);

    res.send(randomProduct)
});
