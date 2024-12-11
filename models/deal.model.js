const mongoose = require('mongoose');



const dealSchema = mongoose.Schema({
    title: String,
    description: String,
    discountPercentage: Number,
    packageIncluded: Array,
});

const Deal = mongoose.model('Deal', dealSchema, 'deals');

module.exports = Deal;