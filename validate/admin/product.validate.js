module.exports.createProductPost = async (req, res, next) => {
    if(req.body.title.length < 5){
        req.flash('error', 'Title must more than 5 characters !');
        res.redirect("back");
        return;
    }

    next();
}