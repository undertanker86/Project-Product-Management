const dashBoardRoute = require("./dashboard.route.js");
const productRoute = require("./product.route.js");
const systemConfig = require("../../config/system.js");
module.exports.index = (app) =>{
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, dashBoardRoute);
    app.use(`${PATH_ADMIN}/products`, productRoute);
    
}