const Product = require("../../models/product.model")
const User = require("../../models/user.model")
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

    .limit(4)
    const products_2 = [];
    for(const item of productsFeatured){
        item.priceOld = parseFloat((item.colors[0]).price) 
                      + parseFloat((item.capacities[0]).price) 
                      + parseFloat((item.repayments[0]).price) * parseFloat((item.repayments[0]).name)
                      + (parseFloat((item.freeSMS).price) * parseFloat((item.freeSMS).number))
                        + (parseFloat((item.freeMinutes).price) * parseFloat((item.freeMinutes).number))
                        + (parseFloat((item.freeGB).price) * parseFloat((item.freeGB).number));
        console.log(item.priceOld);
        item.priceNew = item.priceOld - (item.priceOld * parseFloat(item.discountPercentage) / 100);
        
        if (item.title.endsWith("Only")) {
            // Lưu sản phẩm vào mảng products_2
            products_2.push(item);
          }
    }

 
    
    let result = 0;
    const users = await User.find({ 
        token: req.cookies.tokenUser,
    });

    if(users.length > 0){
        result = 1;
    }
   
    // New products

    // const productsNew = await Product
    // .find({
    //     deleted: false,
    //     status: "active",
    // })
    // .sort({
    //     position: "desc"
    // })

    // .limit(6)
    // for(const item of productsNew){
    //     item.priceNew = item.price - (item.price * item.discountPercentage / 100)
    //     item.priceNew = item.priceNew.toFixed(2)
    // }

    // // Discound products

    // const productsDiscount = await Product
    // .find({
    //     deleted: false,
    //     status: "active",
    // })
    // .sort({
    //     discountPercentage: "desc"
    // })

    // .limit(6)
    // for(const item of productsDiscount){
    //     item.priceNew = item.price - (item.price * item.discountPercentage / 100)
    //     item.priceNew = item.priceNew.toFixed(2)
    // }

    // // select category products
    // const productsChoose = await Product
    // .find({
    //     _id: {$in: ['66e2bf7ce7608291e1de7380', '66dc50376b413184fa14b8ba']},
    //     deleted: false,
    //     status: "active",
    // })
    // .sort({
    //     position: "desc"
    // })

    // .limit(6)
    // for(const item of productsChoose){
    //     item.priceNew = item.price - (item.price * item.discountPercentage / 100)
    //     item.priceNew = item.priceNew.toFixed(2)
    // }


    res.render("client/pages/home/index.pug", {
        pageTitle: "Home",
        productsFeatured: productsFeatured,
        users: users,
        result: result,
        products_2: products_2,
        // productsNew: productsNew,
        // productsDiscount: productsDiscount,
        // productsChoose: productsChoose
    })
}