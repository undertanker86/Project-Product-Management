const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
const userSocket = require("../../sockets/client/user.socket");
module.exports.callBack = async (req, res) => {
    // Access the user object, which includes the accessToken and profile
    const { accessToken, profile } = req.user;
  
    // You can now use accessToken and profile in your callback logic
    // console.log('Access Token:', accessToken);
    // console.log('User Profile:', profile);
  
    // // Example response:
    // res.send(`Hello, ${profile.displayName}! Access Token: ${accessToken}`);

    // if(existUser) {
    //   // req.flash("error", "Email đã tồn tại trong hệ thống!");
    //   res.redirect("back");
    //   return;
    // }


    if (profile.id) {
      const existUser = await User.findOne({
        email: profile.emails[0].value,
        deleted: false
      });
      if(existUser) {
        // req.flash("error", "Email exist!");
        // res.cookie("tokenUser", newUser.token);
        res.cookie("tokenUser", existUser.token);
        req.flash("success", "Login Success!");
        res.redirect("/");

      }

      else{
        const dataUser = {
          fullName: profile.name.familyName + ' ' + profile.name.givenName,
          email: profile.emails[0].value,
          password: md5(profile.id),
          token: generateHelper.generateRandomString(30),
          status: "active"
        };
        const newUser = new User(dataUser);
        await newUser.save();
        res.cookie("tokenUser", newUser.token);
        req.flash("success", "Login Success!");
        res.redirect("/");
      }
    }
  }
  
  module.exports.google = (req, res) => {
    res.send("Google authentication initiated.");
  }
  
  module.exports.ok = (req, res) => {
    console.log(process.env.googleClientID);
    console.log(process.env.googleClientSecret);
    res.send("Google credentials are logged.");
  }
  