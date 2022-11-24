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
            return(
                `Cart labeled with id: ${Cart.id} added.`
            ) 
        }catch{
            return Error("Error at Cart.save(cart)")
        }
    }
}

module.exports= {Cart};
