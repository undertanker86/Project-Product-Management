const productRoute = require("./product.route.js");
const homeRoute = require("./home.route.js");
const cartRoute = require("./cart.route.js");
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const orderRoute = require("./order.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userRoute = require("./user.route.js");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authRoute = require("./auth.route");  
const chatRoute = require("./chat.route");
module.exports.index = (app) =>{

    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cart);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.general);

    app.use("/", homeRoute);
    
    app.use("/products", productRoute);

    app.use("/cart", cartRoute);

    app.use("/order", orderRoute);

    app.use("/user", userRoute);
    app.use("/auth", authRoute);
    app.use("/chat", userMiddleware.requireAuth ,chatRoute);

    app.get("*", (req, res) => {
        res.render("client/pages/errors/404", {
          pageTitle: "404 Not Found",
        });
      });
    
}