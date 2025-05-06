const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    apparel: String, // This field will store one of: 'full-sleeve', 'five-sleeve', 'hoodies', etc.
    price: Number,
    salePrice: Number,
    totalStock: Number
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);