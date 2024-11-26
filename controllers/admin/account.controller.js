const md5 = require('md5');
const Role = require("../../models/role.model");
const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
      });

    for (const item of records) {
        const role = await Role.findOne({
          _id: item.role_id,
          deleted: false
        });
        item.role_title = role.title;
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Management Account",
        records: records
    })
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Create Management Account",
        roles: roles
    })
}


module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    const account = new Account(req.body);
    await account.save();

    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.edit = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    });
    res.render("admin/pages/accounts/edit.pug", {
        pageTitle: "Edit Management Account",
        roles: roles,
        account: account
    })
}


module.exports.editPatch = async (req, res) => {
    await Account.updateOne({
        _id: req.params.id
    }, req.body);
    req.flash('success', 'Update account success!');
    res.redirect(`back`);
}

module.exports.changePassword = async (req, res) => {
    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    });
    res.render("admin/pages/accounts/change-password.pug", {
        pageTitle: "Change Password Account",
        account: account
    })
}


module.exports.changePasswordPatch = async (req, res) => {
    await Account.updateOne({
        _id: req.params.id,
        deleted: false
    }, {
        password: md5(req.body.password)
    });
    req.flash('success', 'Change password success!');
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.myProfile = async (req, res) => {

    res.render("admin/pages/accounts/my-profile.pug", {
        pageTitle: "Profile",
    })
}


