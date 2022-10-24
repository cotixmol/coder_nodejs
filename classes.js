const fs = require("fs")

class Contenedor{
    static id=0;
    constructor(fileName){
        this.fileName = fileName;
    }

    save(object){
        try{
            Contenedor.id++
            console.log(`El numero de id es: ${Contenedor.id}`)

            if (Contenedor.id===1){
                fs.writeFileSync(`./${this.fileName}.txt`,JSON.stringify([{id:Contenedor.id,...object}],null,2))
            }else{
                let contenido = fs.readFileSync(`./${this.fileName}.txt`,"utf-8")
                let elementos = JSON.parse(contenido)
                elementos.push({id:Contenedor.id,...object})
                fs.writeFileSync(`./${this.fileName}.txt`,JSON.stringify(elementos,null,2))
            }

        }catch{
            return Error("Error en Contenedor.save")
        }
    }

    async getById(id){
        try{
            const contenido = await fs.promises.readFile(`./${this.fileName}.txt`,"utf-8")
            const contenidoObj = JSON.parse(contenido)
            const objetoId = contenidoObj.filter((elm)=>elm.id == id)
            return objetoId
        }catch{
            return Error("Error en Contenedor.getById")
        }
    }

    async getAll(){
        try{
            const contenido = await fs.promises.readFile(`./${this.fileName}.txt`,"utf-8")
            const contenidoArray = JSON.parse(contenido)
            return contenidoArray
        }catch(error){
            return Error("Error in Contenedor.getAll()")
        }
    }

    async deleteById(id){
        try{
            const contenido = await fs.promises.readFile(`./${this.fileName}.txt`,"utf-8")
            const contenidoObj = JSON.parse(contenido)
            const objetoId = contenidoObj.filter((elm)=>elm.id != id)
            await fs.promises.writeFile(`./${this.fileName}.txt`,JSON.stringify(objetoId,null,2))
            console.log(`Objeto con id ${id} eliminado`)
        }catch{
            return Error("Error en Contenedor.deleteById. Id posiblemente invalido.")
        }

    }

    deleteAll(){
        fs.writeFileSync(`./${this.fileName}.txt`,"[]")
    }
}

module.exports={ Contenedor } 