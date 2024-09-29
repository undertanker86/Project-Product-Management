const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, 'i');
        find.title = regex;
    }

    let limitItems = 4;
    let page = 1;

    if(req.query.page){
        page = parseInt(req.query.page);
    }
    if(req.query.limit){
        limitItems = parseInt(req.query.limit);
    }
    const skip = (page - 1) * limitItems;
    const totalProduct = await Product.countDocuments(find);
    const totalPages = Math.ceil(totalProduct / limitItems);

    const products = await Product.find(find).limit(limitItems).skip(skip).sort({position: "desc"});

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Products",
        products: products,
        totalPage: totalPages,
        currentPage: page,
    })
}

module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        status: req.body.status
    });
    
    req.flash('success', 'Success change status !');

    res.json({
        code: 200,
    });
}
module.exports.changeMulti = async (req, res) => {
    switch (req.body.status) {
        case 'active':
        case 'inactive':
            await Product.updateMany({
                _id: req.body.ids
                }, {
                    status: req.body.status
                });
                req.flash('success', 'Success change status !');

                res.json({
                    code: 200,
                });
            break;
        case 'delete':
            await Product.updateMany({
                _id: req.body.ids}, 
                { deleted: true
            });
            req.flash('success', 'Success delete products !');
            res.json({
                code: 200,
            });
            break;
        default:
            break;
    }
}

module.exports.deleteProduct = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        deleted: true
    });
    req.flash('success', 'Success delete product !');
    res.json({
        code: 200,
    });
}

module.exports.changePosition = async (req, res) => {
    await Product.updateOne({
        _id: req.body.id
    }, {
        position: req.body.position
    });
    req.flash('success', 'Success change position !');

    res.json({
        code: 200,
    });
}


module.exports.createProduct = async (req, res) => {
    
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Create products",
    })
}

module.exports.createProductPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    else{
        const countRecord = await Product.countDocuments();
        req.body.position = countRecord + 1;
    }
    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const record = new Product(req.body);
    await record.save(); 
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

module.exports.editProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/products/edit.pug", {
        pageTitle: "Edit products",
        product: product,
    })
}

module.exports.editProductPatch = async (req, res) => {
    const id =  req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    // const record = new Product(req.body);
    // await record.save(); 
    // res.redirect(`/${systemConfig.prefixAdmin}/products`);
    await Product.updateOne(
        {_id: id,
        deleted: false
        }, req.body
    );
    req.flash('success', 'Success edit product !');
    res.redirect("back");
}

module.exports.detailProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/products/detail.pug", {
        pageTitle: "Detail products",
        product: product,
    })
}



