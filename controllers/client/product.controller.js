const Product = require('../../models/product.model.js');
const ProductCategory = require('../../models/product-catergory.model');
module.exports.index = async (req, res) => {
    const products = await Product
    .find({
        status: "active",
        deleted: false
    })
    .sort({
        position: "desc"
    });
    console.log(products);

    for(const item of products){
        
        // item.priceNew = item.price - item.price * item.discountPercentage / 100;
        // item.priceNew = item.priceNew.toFixed(0);
        // console.log(parseFloat((item.colors[0]).price));

        item.priceOld = parseFloat((item.colors[0]).price) 
                      + parseFloat((item.capacities[0]).price) 
                      + parseFloat((item.repayments[0]).price) * parseFloat((item.repayments[0]).name)
                      + (parseFloat((item.freeSMS).price) * parseFloat((item.freeSMS).number))
                        + (parseFloat((item.freeMinutes).price) * parseFloat((item.freeMinutes).number))
                        + (parseFloat((item.freeGB).price) * parseFloat((item.freeGB).number));
        console.log(item.priceOld);
        item.priceNew = item.priceOld - (item.priceOld * parseFloat(item.discountPercentage) / 100);
        
        // item.priceNew = item.priceNew.toFixed(0);
    }   
    // console.log(products);
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

    if(product.category_id){
        category = await ProductCategory.findOne({
            _id: product.category_id,
            deleted: false,
            status: "active",
        });

        product.category = category;
    }



    // product.priceNew = product.price - product.price * product.discountPercentage / 100;
    // product.priceNew = product.priceNew.toFixed(0);
   
     
        // product.priceOld = Number((product.colors[0]).price) + Number((product.capacities[0]).price)+ Number((product.repayments[0]).price); 
        // product.priceNew = product.priceOld - product.priceOld * product.discountPercentage / 100;
        // product.priceNew = product.priceNew.toFixed(0);
        product.priceOld = parseFloat((product.colors[0]).price) 
        + parseFloat((product.capacities[0]).price) 
        + parseFloat((product.repayments[0]).price) * parseFloat((product.repayments[0]).name)
        + (parseFloat((product.freeSMS).price) * parseFloat((product.freeSMS).number))
        + (parseFloat((product.freeMinutes).price) * parseFloat((product.freeMinutes).number))
        + (parseFloat((product.freeGB).price) * parseFloat((product.freeGB).number));

        product.priceNew = product.priceOld - (product.priceOld * parseFloat(product.discountPercentage) / 100);


    res.render("client/pages/products/detail.pug", {
        pageTitle: product.title,
        product: product,
    })
}

module.exports.categoryProduct = async (req, res) => {
    let products = [];
    const slugCategory = req.params.slugCategory;

  
    if(slugCategory == "Hot-Packages"){
        // products = await Product
        // .find({
        //     status: "active",
        //     deleted: false
        // })
        // .sort({
        //     position: "desc"
        // });
        const find = {
            status: "active",
            deleted: false,
        }
        
        const sort = {};
        if(req.query.sortKey && req.query.sortValue){
            const sortKey = req.query.sortKey;
            const sortValue = req.query.sortValue;
            sort[sortKey] = sortValue;
        }
        else{
            sort["position"] = "desc";
        }
         products = await Product.find(find).sort(sort);
            for(const product of products){
         product.priceOld = parseFloat((product.colors[0]).price) 
         + parseFloat((product.capacities[0]).price) 
         + parseFloat((product.repayments[0]).price) * parseFloat((product.repayments[0]).name)
         + (parseFloat((product.freeSMS).price) * parseFloat((product.freeSMS).number))
         + (parseFloat((product.freeMinutes).price) * parseFloat((product.freeMinutes).number))
         + (parseFloat((product.freeGB).price) * parseFloat((product.freeGB).number));
 
         product.priceNew = product.priceOld - (product.priceOld * parseFloat(product.discountPercentage) / 100);
            }
    }

    else{
        const categoryData = await ProductCategory.findOne({
            slug: slugCategory,
            deleted: false,
            status: "active",
        })
    
        const allCategoryChildren = []
    
        const getCartegoryChildren = async (parentId) =>{
            const childs = await ProductCategory.find({
                parent_id: parentId,
                deleted: false,
                status: "active",
            })
    
            for(const child of childs){
                allCategoryChildren.push(child.id);
    
                await getCartegoryChildren(child.id);
            }
        };
    
        await getCartegoryChildren(categoryData.id);
        // console.log("Check");
        console.log(allCategoryChildren);
    
        products = await Product.find({
            category_id: {$in: [categoryData.id, ...allCategoryChildren ]},
            deleted: false,
            status: "active",
        }).sort({position: "desc"});
    
        for(const item of products){
            item.priceOld = parseFloat((item.colors[0]).price) 
            + parseFloat((item.capacities[0]).price) 
            + parseFloat((item.repayments[0]).price) * parseFloat((item.repayments[0]).name)
            + (parseFloat((item.freeSMS).price) * parseFloat((item.freeSMS).number))
            + (parseFloat((item.freeMinutes).price) * parseFloat((item.freeMinutes).number))
            + (parseFloat((item.freeGB).price) * parseFloat((item.freeGB).number));
    
            item.priceNew = item.priceOld - (item.priceOld * parseFloat(item.discountPercentage) / 100);
        }
    }

    res.render("client/pages/products/index.pug", {
        pageTitle: "Product Categories",
        products: products,
        category: req.params.slugCategory,
    })


}

module.exports.searchProduct = async (req, res) => {
    const keyword = req.query.keyword;

    let products = [];

    if(keyword){
        const regex = new RegExp(keyword, 'i');
        products = await Product
            .find({
                title: regex,
                deleted: false,
                status: "active", 
            })
            .sort({position: "desc"});
        for(const item of products){
                item.priceOld = parseFloat((item.colors[0]).price) 
                + parseFloat((item.capacities[0]).price) 
                + parseFloat((item.repayments[0]).price) * parseFloat((item.repayments[0]).name)
                + (parseFloat((item.freeSMS).price) * parseFloat((item.freeSMS).number))
                + (parseFloat((item.freeMinutes).price) * parseFloat((item.freeMinutes).number))
                + (parseFloat((item.freeGB).price) * parseFloat((item.freeGB).number));
        
                item.priceNew = item.priceOld - (item.priceOld * parseFloat(item.discountPercentage) / 100);
            }

        
    }

    res.render("client/pages/products/search.pug", {
        pageTitle: `Search Product: ${keyword}`,
        keyword: keyword,
        products: products,
    })
}