const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    console.log("Raw req.query:", req.query);
    const { category = [], apparel = [], sortBy = "price-lowtohigh" } = req.query;

    console.log("Parsed category param:", category);
console.log("Parsed apparel param:", apparel);

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
   
    if (apparel.length) {
      filters.apparel = { $in: apparel.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });

    console.log("Final filters applied to DB:", filters);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
       const {id} =req.params
       const product = await Product.findById(id)

       if(!product) return res.status(404).json({
          success: false,
          message: 'Product not found'
       })

       res.status(200).json({
        success: true,
        data: product,
      });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};




module.exports = { getFilteredProducts , getProductDetails };
 