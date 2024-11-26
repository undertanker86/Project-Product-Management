const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-catergory.model.js");
module.exports.index = async (req, res) => {
    const listCategory = await ProductCategory.find({
        deleted: false
      });

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Product Category",
        listCategory: listCategory
    })
}

module.exports.createProductCategory = async(req, res) => {
    const listCategory = await ProductCategory.find({
        deleted: false
      });
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Create Product Category",
        listCategory: listCategory
    }) 
}

module.exports.createProductCategoryPost = async (req, res) => {
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countRecord = await ProductCategory.countDocuments();
        req.body.position = countRecord + 1;
      }
      const record = new ProductCategory(req.body);
      await record.save();
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}


module.exports.editProductCategory = async (req, res) => {
    const id = req.params.id;

    const listCategory = await ProductCategory.find({
        deleted: false
      });
    
      const category = await ProductCategory.findOne({
        _id: id,
        deleted: false
      }); 
    
      console.log(category);

    res.render("admin/pages/products-category/edit.pug", {
        pageTitle: "Edit Product Category",
        listCategory: listCategory,
        category: category
    });
}

module.exports.editProductCategoryPatch = async (req, res) => {
    const id = req.params.id;
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
      }
    else{
        delete req.body.position;
    }

    await ProductCategory.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash("success", "Update success!");
    res.redirect('back');

}
