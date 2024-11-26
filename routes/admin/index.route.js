const dashBoardRoute = require("./dashboard.route.js");
const productRoute = require("./product.route.js");
const productCategoryRoute = require("./product-category.route.js");
const systemConfig = require("../../config/system.js");
const roleRoute = require("./role.route.js");
const accountRoute = require("./account.route.js");
const authRoute = require("./auth.route.js");
const settingRoute = require("./setting.route");
const authMiddleware = require('../../middlewares/admin/auth.middleware.js');
const orderRoute = require("./order.route.js");
module.exports.index = (app) =>{
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth ,dashBoardRoute);
    app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth ,productRoute);
    app.use(`${PATH_ADMIN}/products-category`, authMiddleware.requireAuth ,productCategoryRoute);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth ,roleRoute);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth ,accountRoute);
    app.use(`${PATH_ADMIN}/auth`, authRoute);
    app.use(
        `${PATH_ADMIN}/settings`, 
        authMiddleware.requireAuth, 
        settingRoute
      );

    app.use(`${PATH_ADMIN}/orders`, authMiddleware.requireAuth ,orderRoute);
    
}