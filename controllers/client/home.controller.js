const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    // Outstanding products
    const productsFeatured = await Product
    .find({
        deleted: false,
        status: "active",
        featured: "1"
    })
    .sort({
        position: "desc"
    })

    .limit(6)
    for(const item of productsFeatured){
        item.priceNew = item.price - (item.price * item.discountPercentage / 100)
        item.priceNew = item.priceNew.toFixed(2)
    }
    // New products

    const productsNew = await Product
    .find({
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })

    .limit(6)
    for(const item of productsNew){
        item.priceNew = item.price - (item.price * item.discountPercentage / 100)
        item.priceNew = item.priceNew.toFixed(2)
    }

    // Discound products

    const productsDiscount = await Product
    .find({
        deleted: false,
        status: "active",
    })
    .sort({
        discountPercentage: "desc"
    })

    .limit(6)
    for(const item of productsDiscount){
        item.priceNew = item.price - (item.price * item.discountPercentage / 100)
        item.priceNew = item.priceNew.toFixed(2)
    }

    // select category products
    const productsChoose = await Product
    .find({
        _id: {$in: ['66e2bf7ce7608291e1de7380', '66dc50376b413184fa14b8ba']},
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })

    .limit(6)
    for(const item of productsChoose){
        item.priceNew = item.price - (item.price * item.discountPercentage / 100)
        item.priceNew = item.priceNew.toFixed(2)
    }


    res.render("client/pages/home/index.pug", {
        pageTitle: "Home",
        productsFeatured: productsFeatured,
        productsNew: productsNew,
        productsDiscount: productsDiscount,
        productsChoose: productsChoose
    })
}