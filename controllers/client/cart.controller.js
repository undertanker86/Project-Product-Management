const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const tokenUser = req.cookies.tokenUser;
  const cart = await Cart.findOne({
    _id: cartId
  });

  const user = await User.findOne({
    token: tokenUser
  });


  const products = cart.products;
  const existProduct = products.find(item => item.productId == req.params.id);
  if(existProduct) {
    existProduct.quantity = existProduct.quantity + parseInt(req.body.quantity);
  } else {
    const product = {
      productId: req.params.id,
      quantity: parseInt(req.body.quantity)
    };
  
    products.push(product);
  }

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products,
    userId: user.id
  });
  res.redirect("back");

}

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;
  let total = 0;
  for(const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
      deleted: false,
      status: "active"
    });
    item.thumbnail = infoItem.thumbnail;  
    item.title = infoItem.title;
    item.price = infoItem.price;
    item.slug = infoItem.slug;
    if(infoItem.discountPercentage > 0){
      item.priceNew = infoItem.price - (infoItem.price * infoItem.discountPercentage / 100);
      item.priceNew = item.priceNew.toFixed(0);
    }

    item.total = item.priceNew * item.quantity;

    total += item.total;
  }

  res.render("client/pages/cart/index", {
    pageTitle: "Cart",
    products: products,
    total: total
  });
}

module.exports.delete = async (req, res) => {
  const productId = req.params.id;
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  })
  const products = cart.products.filter(item => item.productId != productId);

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });

  res.redirect("back");
}

module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const product = req.body;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  const productUpdate = products.find(item => item.productId == product.productId);
  productUpdate.quantity = parseInt(product.quantity);

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  })

  res.json({
    code: 200,
    message: "Update quantity success"
  });
}