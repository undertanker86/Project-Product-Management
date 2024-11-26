const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { create } = require('./product-catergory.model');
mongoose.plugin(slug); // Add slug to mongoose
const productSchema = mongoose.Schema({
    title: String,
    slug: { 
        type: String, 
        slug: "title" 
    },
    category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: String,
    createdAt: Date,
    updatedBy: String,
    updatedAt: Date,
    featured: {
        type: String,
        default: "0"
    },
    deleted: {
        type: Boolean,
        default: false,
        unique: true
    }
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;