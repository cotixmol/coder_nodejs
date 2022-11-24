class Cart{
    static id=0;
    static CartList = [];

    createCart(){
        try{
            Cart.id++
            Cart.CartList.push({id: Cart.id,
                                timestamp: Date.now(),
                                products: [],
                            })
        }catch{
            return Error("Error at Cart.save(cart)")
        }
    }

    getById(id){
        try{
            const cartObj = Cart.CartList.filter(elm=>elm.id==id)
            return cartObj
        }catch{
            return Error("Error en Cart.getById(id)")
        }
    }

    deleteCartById(id){
        try{
            const CartListDeletedId = Cart.CartList.filter((elm)=>elm.id != id)
            Cart.CartList = CartListDeletedId;
        }catch{
            return Error("Error en Cart.deleteById(id)")
        }
    }

}

module.exports= {Cart};
