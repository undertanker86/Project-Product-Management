module.exports.index = async (req, res) => {
    res.render("admin/pages/orders/index", {
        pageTitle: "Order",
    });

}