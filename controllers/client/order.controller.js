const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
const generateHelper = require("../../helpers/generate.helper");

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
  let count_deal = 0;
  for(const item of products) {
    description[i] = `Color: ${item.color}<br>
                      Capacity: ${item.capacity}<br>
                      Repayment: ${item.repayment}<br>
                      Free-SMS: ${item.freeSMS}<br>
                      Free-Minutes: ${item.freeMinutes}<br>
                      Free-GB: ${item.freeGB}`;
    if(item.title ==  "iPhone 14 - Phone Only"){
                        if(count_deal == 0 && item.quantity > 1){
                          count_deal = 1;
                          count_deal = item.quantity * count_deal;
                  
                        }
                        else{
                          count_deal++;
                        }
                      }
    item.total = item.priceNew * item.quantity;
    // console.log(item.total);
    total += item.total;
    i++;
  }
  if(count_deal > 1){
    total = total - (total * 0.1);
  }
  console.log(count_deal);
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
 
  products_order = JSON.parse(order.products);

  const cart = await Cart.findOne({
    _id: cartId
  });


  const dataOrder = {
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    products: [],
    userId: cart.userId,
    card: {
      name: order.cardType,
      number: order.creditCardNumber,
      expMonth: order.expMonth,
      expYear: order.expYear,
      cvv: order.cvv
    },
    status: "pending",
    total: order.total  
  };
  for (const item of products_order) {
    dataOrder.products.push(item);
  }
  // const products = cart.products;

  // for (const item of products) {
  //   const infoItem = await Product.findOne({
  //     _id: item.productId
  //   });

  //   const product = {
  //     productId: item.productId,
  //     price: infoItem.price,
  //     discountPercentage: infoItem.discountPercentage,
  //     quantity: item.quantity
  //   };

  //   dataOrder.products.push(product);
  // }

  const newOrder = new Order(dataOrder);
  await newOrder.save();

  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });
  // res.send("Order success");
  res.redirect(`/order/success/${newOrder.id}`);
}


module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({
    _id: orderId
  });
  let description = [];
  let i = 0;
  for(const item of order.products) {
    description[i] = `Color: ${item.color}<br>
                      Capacity: ${item.capacity}<br>
                      Repayment: ${item.repayment}<br>
                      Free-SMS: ${item.freeSMS}<br>
                      Free-Minutes: ${item.freeMinutes}<br>
                      Free-GB: ${item.freeGB}`;
    i++;
  }
  const user_order = await User.findOne({
    _id: order.userId
  });

  const subject = `Thank you for your order ! Your order ID is ${order.id}`;
  const htmlText = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Order!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        padding: 20px;
        background-color: #f8f9fa;
      }
      h2 {
        color: #007BFF;
      }
      h3 {
        color: #333;
      }
      p {
        font-size: 14px;
      }
      .order-details, .product-details {
        margin-top: 20px;
        border: 1px solid #ddd;
        padding: 15px;
        background-color: #fff;
        border-radius: 8px;
      }
      .order-details ul, .product-details ul {
        list-style-type: none;
        padding-left: 0;
      }
      .order-details li, .product-details li {
        padding: 8px 0;
      }
      .footer {
        font-size: 12px;
        color: #aaa;
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
  
    <h2>Dear ${user_order.fullName},</h2>
  
    <p>Thank you for placing your order with us! We're excited to confirm that we've received your order, and we’re processing it right now.</p>
  
    <h3>Here are the details of your order:</h3>
    <div class="order-details">
      <ul>
        <li><strong>Order ID</strong>: ${order.id}</li>
        <li><strong>Total Amount</strong>: ${order.total}</li>
      </ul>
    </div>
  
  
    <p>We will contact you shortly to confirm your order and provide more information on the shipping process.</p>
  
    <p>If you have any questions or need assistance, feel free to reach out to us.</p>
  
    <p>Thank you once again for choosing <strong>Beta</strong>!</p>
  
    <p>Best regards,</p>
    <p>The Beta Team</p>

  
  </body>
  </html>
  `;
  sendMailHelper.sendMail(user_order.email, subject, htmlText);

  res.render("client/pages/order/success.pug", {
    pageTitle: "Order Success",
    order: order,
    description: description,
    // total: total
  });
};