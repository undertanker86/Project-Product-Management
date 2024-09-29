const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug); // Add slug to mongoose
const productSchema = mongoose.Schema({
    title: String,
    slug: { 
        type: String, 
        slug: "title" 
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false,
        unique: true
    }
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;