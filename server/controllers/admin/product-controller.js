const { handleImageUpload } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const imageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;


    const result = await handleImageUpload(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error Occured",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    console.log("REQ BODY of add prduct→", req.body); 
    const {
      image,
      title,
      description,
      category,
      apparel,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      apparel,
      price,
      salePrice,
      totalStock,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
const fetchAllProducts = async (req, res) => {
  try {
    const productLists = await Product.find({});
    res.status(200).json({
      success: true,
      data: productLists,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const editProduct = async (req, res) => {
  try {

    const { id } = req.params;
    console.log(id,"editing Id")
    const {
      image,
      title,
      description,
      category,
      apparel,
      price,
      salePrice,
      totalStock,
    } = req.body;

    console.log(req.body)

    const findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(400).json({
        success: false,
        message: " Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.apparel = apparel || findProduct.apparel;
    findProduct.price = price || findProduct.price;
    findProduct.salePrice = salePrice || findProduct.salePrice;
    findProduct.image = image || findProduct.image;
    findProduct.totalStock = totalStock || findProduct.totalStock

    await findProduct.save();
    res.status(200).json({
        success:true,
        data: findProduct
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id);

    if(!product) 
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })

        res.status(200).json({
            success:true,
            message: 'Product deleted Successfully'
        })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  imageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
