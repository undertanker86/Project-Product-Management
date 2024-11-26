const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-catergory.model.js");
const Account = require("../../models/account.model");
const moment = require("moment");
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

    const sort = {};

    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    else{
        sort["position"] = "desc";
    }
    const products = await Product.find(find).limit(limitItems).skip(skip).sort(sort);
    for (const item of products) {
        const infoCreated = await Account.findOne({
            _id: item.createdBy,
            deleted: false
        });
        if(infoCreated){
            item.createdByFullName = infoCreated.fullName;
        }
        else{
            item.createdByFullName = "";
        }
        if(item.createdAt){
            item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY");
        }


        const infoUpdated = await Account.findOne({
            _id: item.updatedBy,
            deleted: false
        });
        if(infoUpdated){
            item.updatedByFullName = infoUpdated.fullName;
        }
        else{
            item.updatedByFullName = "";
        }
        if(item.updatedAt){
            item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY");
        }

        
    }
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Products",
        products: products,
        totalPage: totalPages,
        currentPage: page,
        limit: limitItems,
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
                { 
                deleted: true,
                deletedAt: new Date(),
                deletedBy: res.locals.user.id,
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
        deleted: true,
        deletedAt: new Date(),
        deletedBy: res.locals.user.id,
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
    const listCategory = await ProductCategory.find({
        deleted: false
      });
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Create products",
        listCategory: listCategory
    });

}

module.exports.createProductPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products_create")){
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.createdBy = res.locals.user._id;
        req.body.createdAt = new Date();
        if(req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        else{
            const countRecord = await Product.countDocuments();
            req.body.position = countRecord + 1;
        }
        
        // if(req.file){
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        // console.log(req.body);
        // res.send("ok");
        const record = new Product(req.body);
        await record.save(); 
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    else{
        req.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
   
}

module.exports.editProduct = async (req, res) => {
    
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false
    });
    const listCategory = await ProductCategory.find({
        deleted: false
      });

    res.render("admin/pages/products/edit.pug", {
        pageTitle: "Edit products",
        product: product,
        listCategory: listCategory
    })
}

module.exports.editProductPatch = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit")){
        const id =  req.params.id;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.updatedBy = res.locals.user._id;
        req.body.updatedAt = new Date();
        if(req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        
        // if(req.file){
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
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
    else{
        req.redirect(`/${systemConfig.prefixAdmin}/products`);
    }

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



