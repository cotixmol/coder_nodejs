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

    async getById(id){
        try{
            let productoArray

            await databaseContenedor.from("products").select("*").where("id",id)
            .then((data)=>{
                productoArray = data.map(elm=>({...elm}))
            })
            .catch((error)=>console.log(error))
            // .finally(()=>databaseContenedor.destroy())
            return productoArray;
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

 export {Contenedor};
