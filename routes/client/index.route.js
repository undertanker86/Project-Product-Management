const productRoute = require("./product.route.js");
const homeRoute = require("./home.route.js");
module.exports.index = (app) =>{

    app.use("/", homeRoute);
    
    app.use("/products", productRoute);
    
}