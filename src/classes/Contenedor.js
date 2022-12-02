import knex from "knex";
import { options } from "../../options/mysqlConfig.js";

const databaseContenedor = knex(options)

const isTable = databaseContenedor.schema.hasTable("products");
if(!isTable){
    databaseContenedor.schema.createTable("products",(table)=>{
        table.increments("id");
        table.timestamp("timestamp")
        table.string("name",50);
        table.float("price");
        table.string("thumbnail",1000);
        table.string("description",1000);
        table.string("code",20);
        table.integer("stock");
    })
}

class Contenedor{

    // static id=0;


    // static productsList = [];

    save(product){
        try{
            Contenedor.productsList.push({ timestamp: Date.now(),
                                            ...product})
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
