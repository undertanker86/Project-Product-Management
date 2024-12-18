const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system.js");
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Login",

    });
}

module.exports.loginPost = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await Account.findOne({
        email: email,
        deleted: false
    });
    if(!user) {
        req.flash("error", "Email or password is incorrect");
        res.redirect("back");
        return;
    }

    if(md5(password) !== user.password) {
        req.flash("error", "Email or password is incorrect");
        res.redirect("back");
        return;
    }

    if(user.status != "active") {
        req.flash("error", "Your account is locked");
        res.redirect("back");
        return;
    }
    res.cookie("token", user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}


module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}