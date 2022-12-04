import knex from "knex";
import { options } from "../options/contenedorMysqlConfig.js";

const databaseContenedor = knex(options)

const createTableMysql = async () =>{
    const isTable = await databaseContenedor.schema.hasTable("products")
    if(!isTable){
    await databaseContenedor.schema.createTable("products",(table)=>{
        table.increments("id");
        table.string("timestamp");
        table.string("name",50);
        table.float("price");
        table.string("thumbnail",1000);
        table.string("description",1000);
        table.string("code",20);
        table.integer("stock");
        })
        .then(()=>console.log("Table Created"))
        .catch((error)=>console.log(error))
        .finally(()=>databaseContenedor.destroy())
    }
}

export {createTableMysql};