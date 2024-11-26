module.exports.createProductPost = async (req, res, next) => {
    console.log(req.body._method);
    console.log(req.file);
    if(!req.body.title) {
      console.log(req.body.title);
      req.flash("error", "Title not empty!");
      res.redirect("back");
      return;
    }
    if(req.body.title.length < 5) {
      req.flash("error", "Title must  more than 5 characters!");
      res.redirect("back");
      return;
    }
    next();
  }

//createProductPost

