const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const tokenUser= req.cookies.tokenUser;
  const user = await User.findOne({
    token: tokenUser
  });
  console.log(user);
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
    // item.price = infoItem.price;
    item.slug = infoItem.slug;
  }
  let description = [];
  let i = 0;
  for(const item of products) {
    description[i] = `Color: ${item.color}<br>
                      Capacity: ${item.capacity}<br>
                      Repayment: ${item.repayment}<br>
                      Free-SMS: ${item.freeSMS}<br>
                      Free-Minutes: ${item.freeMinutes}<br>
                      Free-GB: ${item.freeGB}`;

    item.total = item.priceNew * item.quantity;
    console.log(item.total);
    total += item.total;
    i++;
  }
  // console.log(description[0]);
  
  res.render("client/pages/order/index", {
    pageTitle: "Order",
    products: products,
    total: total,
    description: description,
    user: user
  });

};
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const order = req.body;



  const cart = await Cart.findOne({
    _id: cartId
  });

  const dataOrder = {
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    products: [],
    userId: cart.userId,
  };

  const products = cart.products;

  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });

    const product = {
      productId: item.productId,
      price: infoItem.price,
      discountPercentage: infoItem.discountPercentage,
      quantity: item.quantity
    };

    dataOrder.products.push(product);
  }

  const newOrder = new Order(dataOrder);
  await newOrder.save();

  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });

  res.redirect(`/order/success/${newOrder.id}`);
}


module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({
    _id: orderId
  });
  let total = 0;
  for (const item of order.products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.priceNew = item.price;
    if(item.discountPercentage > 0) {
      item.priceNew = (1 - item.discountPercentage/100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
    item.total = item.priceNew * item.quantity;
    total += item.total;
  }
  res.render("client/pages/order/success.pug", {
    pageTitle: "Order Success",
    order: order,
    total: total
  });
};