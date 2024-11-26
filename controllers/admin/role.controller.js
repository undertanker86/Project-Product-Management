const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Roles",
        records: records
    })
}

module.exports.createRole = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Create Role",
    })
}

module.exports.createRolePost = async (req, res) => {
    const role = new Role(req.body);

    await role.save();
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

module.exports.editRole = async (req, res) => {

    const id = req.params.id;
    const record = await Role.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/roles/edit.pug", {
        pageTitle: "Edit Role",
        role: record,
    })

}

module.exports.editRolePatch = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({
        _id: id,
        deleted: false}, req.body);

    req.flash("success", "Update role success!");
    res.redirect("back");
}

module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: "Permissions",
        records: records
    })
}

module.exports.permissionsPatch = async (req, res) => {
    for (const item of req.body) {
        await Role.updateOne({
            _id: item.roleId,
            deleted: false
        }, {
            permissions: item.permissions
        });
    }

    req.flash("success", "Update permissions success!");

    res.json({
        code: 200
    });
}


