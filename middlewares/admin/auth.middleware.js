const systemConfig = require("../../config/system.js");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth  =  async (req, res, next) => {
    if(!req.cookies.token) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
        status: "active"
    });

    if(!user) {
        res.clearCookie("token");
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    res.locals.user = user; 
    const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
    });
    res.locals.role = role;
    next();
};