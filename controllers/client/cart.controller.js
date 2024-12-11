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

  // console.log((req.body));

  
  const products = cart.products;
  // console.log("Products in cart:", products); 
  const existProduct = products.find(item => item.productId == req.params.id && item.priceNew == parseFloat(req.body.priceNew));


  // console.log("Found product:", existProduct);
  if(existProduct) {
    existProduct.quantity = existProduct.quantity + parseInt(req.body.quantity);
  } else {
    const product = {
      productId: req.params.id,
      quantity: parseInt(req.body.quantity),
      priceNew: parseFloat(req.body.priceNew),
      color: req.body.color,
      capacity: req.body.capacity,
      repayment: req.body.repayment,
      freeSMS: req.body.free_sms,
      freeMinutes: req.body.free_minutes,
      freeGB: req.body.free_gb
    };
  
    products.push(product);
  }

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products,
    userId: user.id
  });
  req.flash("success", "Success add to cart");
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
    // item.price = infoItem.price;
    item.slug = infoItem.slug;
  }
  let description = [];
  let i = 0;
  let count_deal = 0;
  let mes_discount = "";
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
   
    total += item.total;
    i++;
  }
  if(count_deal > 1){
    total = total - (total * 0.1);
    mes_discount = "- 10% discount";
  }
  console.log(count_deal);
  // console.log(description[0]);
  
  res.render("client/pages/cart/index", {
    pageTitle: "Cart",
    products: products,
    total: total,
    description: description,
    mes_discount: mes_discount
  });
}

module.exports.delete = async (req, res) => {
  const productId = req.params.id;
  const priceNew = req.params.price;
  console.log("Price:", priceNew);
  console.log("Product ID:", productId);
  
  const cartId = req.cookies.cartId;
  
  // Tìm cart theo cartId
  const cart = await Cart.findOne({
    _id: cartId
  });

  // Sử dụng phương thức updateOne và toán tử $pull để xóa sản phẩm trong mảng products
  await Cart.updateOne(
    { _id: cartId },
    {
      $pull: {
        products: { 
          productId: productId, 
          priceNew: parseFloat(priceNew) // Đảm bảo so sánh giá trị là số thực
        }
      }
    }
  );

  // Điều hướng lại trang trước (hoặc trang khác nếu cần)
  res.redirect("back");
}

module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const product = req.body;
  console.log(product);
  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  const productUpdate = products.find(item => item.productId == product.productId);
  productUpdate.quantity = parseInt(product.quantity);
  console.log(products);
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