const Product = require('../../models/product.model.js');

module.exports.index = async (req, res) => {
    const products = await Product
    .find({
        status: "active",
        deleted: false
    })
    .sort({
        position: "desc"
    });
    for(const item of products){
        item.priceNew = item.price - item.price * item.discountPercentage / 100;
        item.priceNew = item.priceNew.toFixed(0);
    }
    console.log(products);
    res.render('client/pages/products/index.pug', {
        pageTitle: 'Products',
        products : products
    });
}

module.exports.detailProduct = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active",
    });



    product.priceNew = product.price - product.price * product.discountPercentage / 100;
    product.priceNew = product.priceNew.toFixed(0);


    res.render("client/pages/products/detail.pug", {
        pageTitle: product.title,
        product: product,
    })
}
