const Product = require("../../models/Product")


const searchProducts = async(req,res)=>{
    try{
         const {keyword}=req.params;
         if(!keyword || typeof keyword !== 'string'){
            return res.status(404).json({
                success:false,
                message:'keyword is required and must eb in string format'
            })
         }

         const regEx = new RegExp(keyword, "i")

         const createSearchQuery ={
            $or: [
                {
                    title: regEx
                },
                {
                    description: regEx
                },
                {
                    category: regEx
                },
                {
                    apparel: regEx
                },
            ]
         }


         const searchResults = await Product.find(createSearchQuery)

         res.status(200).json({
            success: true,
            data: searchResults
         })
    }catch(e){
        res.status(404).json({
            success:false,
            message:'error'
        })
        
    }
}

module.exports ={searchProducts}