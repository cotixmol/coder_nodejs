import { optionsSQLite } from "../../options/chatSqliteConfig.js";
import knex from "knex";

const databaseChat = knex(optionsSQLite)
class Chat{
    // static messagesList=[];

    async addMessage(message){
        let DoesTableExist = await databaseChat.schema.hasTable("chat")
        if(!DoesTableExist){
            await databaseChat.schema.createTable("chat",(table)=>{
                table.string("date",20);
                table.string("user",100);
                table.string("text",1000);
            })
        }

        await databaseChat("chat").insert(message);

        let messagesArray
        await databaseChat.from("chat").select("*")
        .then((data)=>{
            messagesArray = data;
        })
        .catch((error)=>console.log(error))
        // .finally(()=>databaseChat.destroy())
        return messagesArray;
    }
}

export {Chat}