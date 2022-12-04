import knex from "knex";
import { options } from "../../options/contenedorMysqlConfig.js";

import { createTableMysql } from "../../functions/createTableMysql.js";
createTableMysql();

const databaseContenedor = knex(options)
class Contenedor{
    async save(product){
        try{
            await databaseContenedor("products").insert({timestamp:Date.now(),...product})
            .then(()=>console.log("product added"))
            .catch((error)=>console.log(error))
            .finally(()=>databaseContenedor.destroy())
        }catch{
            return Error("Error en Contenedor.save(object)")
        }
    }
    update(product,id){
        try{
            databaseContenedor.from("products").where("id",id).update({...product})
            .then(()=>console.log("product updated"))
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())

        }catch{
            return Error("Error en Contenedor.update(product,id)")
        }
    }
    async getById(id){
        try{
            let productArray

            await databaseContenedor.from("products").select("*").where("id",id)
            .then((data)=>{
                productArray = data.map(elm=>({...elm}))
            })
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())
            return productArray;
        }catch{
            return Error("Error en Contenedor.getById(id)")
        }
    }
    async getAll(){
        try{
            let productsArray

            await databaseContenedor.from("products").select("*")
            .then((data)=>{
                productsArray = data.map(elm=>({...elm}))
            })
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())
            return productsArray;
        }catch{
            return Error("Error en Contenedor.getById(id)")
        }
    }

    async deleteById(id){
        try{
            await databaseContenedor.from("products").where("id",id).del()
            .then(()=>console.log("data deleted"))
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())
        }catch{
            return Error("Error en Contenedor.deleteById(id)")
        }
    }
 
    deleteAll(){
        try{
            databaseContenedor.from("products").del()
            .then(()=>console.log("data delete"))
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())
        }catch{
            return Error("Error en Contenedor.deleteAll")
        }
    }
}

 export {Contenedor};
