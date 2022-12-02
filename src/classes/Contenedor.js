import knex from "knex";
import { options } from "../../options/contenedorMysqlConfig.js";

import { createTableMysql } from "../../functions/createTableMysql.js";
createTableMysql();

const databaseContenedor = knex(options)
class Contenedor{
    async save(product){
        try{
            await databaseContenedor("products").insert({...product})
            .then(()=>console.log("Producto Agregado"))
            .catch((error)=>console.log(error))
            .finally(()=>databaseContenedor.destroy())
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

 export {Contenedor};
