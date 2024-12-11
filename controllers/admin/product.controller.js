const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-catergory.model.js");
const Account = require("../../models/account.model");
const moment = require("moment");
const Deal = require("../../models/deal.model");
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
        console.log(req.body);
        // Khai bao mang colors va price_colors
        const name_colors = [];
        const price_colors = [];
        const name_capacity = [];
        const price_capacity = [];
        const name_repayment = [];
        const price_repayment = [];
        console.log(req.body);
        for (const key in req.body) {
            if(key.includes("name_color")){
                name_colors.push(req.body[key]);
            }
            if(key.includes("price_color")){
                price_colors.push(req.body[key]);
            }
            if(key.includes("name_capacity")){
                name_capacity.push(req.body[key]);
            }
            if(key.includes("price_capacity")){
                price_capacity.push(req.body[key]);
            }
            if(key.includes("name_repayment")){
                name_repayment.push(req.body[key]);
            }
            if(key.includes("price_repayment")){
                price_repayment.push(req.body[key]);
            }
        }
        number_free_sms = parseInt(req.body.free_sms);
        number_free_minutes = parseInt(req.body.free_minutes);
        number_free_gb = parseInt(req.body.free_gb);


        price_sms = parseInt(req.body.free_sms_price);
        price_minutes = parseInt(req.body.free_minutes_price);
        price_gb = parseInt(req.body.free_gb_price);

        const free_sms = {
            number: number_free_sms,
            price: price_sms
        }
        const free_minutes = {
            number: number_free_minutes,
            price: price_minutes
        }
        const free_gb = {
            number: number_free_gb,
            price: price_gb
        }
        req.body.free_sms = free_sms;
        req.body.free_minutes = free_minutes;
        req.body.free_gb = free_gb;


        req.body.freeSMS = free_sms;


        req.body.freeMinutes = free_minutes;
    

        req.body.freeGB = free_gb;
        
        // req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.createdBy = res.locals.user.id;
        req.body.createdAt = new Date();
        req.body.colors = name_colors.map((item, index) => {
            return {
                name: item,
                price: price_colors[index]
            }
        });
        req.body.capacities = name_capacity.map((item, index) => {
            return {
                name: item,
                price: price_capacity[index]
            }
        });
        req.body.repayments = name_repayment.map((item, index) => {
            return {
                name: item,
                price: price_repayment[index]
            }
        });


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
        console.log(req.body);
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
        number_free_sms = parseInt(req.body.free_sms);
        number_free_minutes = parseInt(req.body.free_minutes);
        number_free_gb = parseInt(req.body.free_gb);


        price_sms = parseInt(req.body.free_sms_price);
        price_minutes = parseInt(req.body.free_minutes_price);
        price_gb = parseInt(req.body.free_gb_price);

        const free_sms = {
            number: number_free_sms,
            price: price_sms
        }
        const free_minutes = {
            number: number_free_minutes,
            price: price_minutes
        }
        const free_gb = {
            number: number_free_gb,
            price: price_gb
        }
        req.body.free_sms = free_sms;
        req.body.free_minutes = free_minutes;
        req.body.free_gb = free_gb;


        req.body.freeSMS = free_sms;


        req.body.freeMinutes = free_minutes;
    

        req.body.freeGB = free_gb;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.updatedBy = res.locals.user._id;
        req.body.updatedAt = new Date();
        if(req.body.position){
            req.body.position = parseInt(req.body.position);
        }
        
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

module.exports.createDeal = async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.render("admin/pages/products/create-deal.pug", {
        pageTitle: "Create deals",
        products: products
    });
}
module.exports.createDealPost = async (req, res) => {
    console.log(req.body);  // Xem toàn bộ dữ liệu gửi lên từ form

    // const { title, description, discountPercentage } = req.body;
    // const quantity = req.body;  // Dữ liệu gửi lên sẽ chứa thông tin về các sản phẩm và số lượng

    // // Tạo danh sách packageIncluded
    // const packageIncluded = [];

    // // Duyệt qua tất cả các key trong req.body
    // for (let productId in quantity) {
    //     // Kiểm tra xem key có phải là ID của sản phẩm (tránh các trường không phải quantity)
    //     if (quantity.hasOwnProperty(productId) && productId !== 'title' && productId !== 'description' && productId !== 'discountPercentage') {
    //         const qty = parseInt(quantity[productId]);

    //         // Nếu số lượng sản phẩm lớn hơn 0, thêm vào packageIncluded
    //         if (qty > 0) {
    //             // Lấy thông tin sản phẩm từ Product bằng productId
    //             const product = await Product.findById(productId);
    //             if (product) {
    //                 // Thêm vào packageIncluded với cấu trúc { name, quantity }
    //                 packageIncluded.push({
    //                     name: product.title,  // Hoặc `product.name` nếu muốn dùng tên khác
    //                     quantity: qty
    //                 });
    //             }
    //         }
    //     }
    // }

    // // Tạo deal mới với thông tin đã xử lý
    // const newDeal = new Deal({
    //     title,
    //     description,
    //     discountPercentage,
    //     packageIncluded
    // });

    // // Lưu deal vào cơ sở dữ liệu
    // await newDeal.save();

    req.flash('success', 'Create deal success!');
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}


