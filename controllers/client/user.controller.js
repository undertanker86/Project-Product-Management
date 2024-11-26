const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
const userSocket = require("../../sockets/client/user.socket");
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Register Account",
  });
};
module.exports.registerPost = async (req, res) => {
  const user = req.body;
  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });
  if(existUser) {
    // req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
    token: generateHelper.generateRandomString(30),
    status: "active"
  };
  const newUser = new User(dataUser);
  await newUser.save();
  res.cookie("tokenUser", newUser.token);
  // req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
};

module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Login Account",
  });
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if(!existUser) {
    req.flash("error", "Email not exist in system!");
    res.redirect("back");
    return;
  }
  if(md5(password) != existUser.password) {
    req.flash("error", "Incorrect Password!");
    res.redirect("back");
    return;
  }
  if(existUser.status != "active") {
    req.flash("error", "Account blocked!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", existUser.token);

  await User.updateOne({
    email: email
  }, {
    statusOnline: "online"
  });

  _io.once("connection", (socket) => {
    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
      userId: existUser.id,
      statusOnline: "online"
    })
  })
  req.flash("success", "Login success!");

  res.redirect("/");
};


module.exports.logout = async (req, res) => {
  await User.updateOne({
    token: req.cookies.tokenUser
  }, {
    statusOnline: "offline"
  });

  _io.once("connection", (socket) => {
    _io.emit("SERVER_RETURN_STATUS_ONLINE_USER", {
      userId: res.locals.user.id,
      statusOnline: "offline"
    })
  })
  res.clearCookie("tokenUser");
  req.flash("success", "Logouted!");
  res.redirect("/");
};

module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Forgot Password",
  });
}

module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false
  });
  if(!existUser) {
    req.flash("error", "Email not exist!");
    res.redirect("back");
    return;
  }


  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  });
  if(!existEmailInForgotPassword) {
    const otp = generateHelper.generateRandomNumber(6);
    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now() + 5*60*1000
    };
  
    const record = new ForgotPassword(data);
    await record.save();


    const subject = "Identify OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
    sendMailHelper.sendMail(email, subject, text);
  }
  res.redirect(`/user/password/otp?email=${email}`);
}


module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Identify OTP",
    email: email
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if(!existRecord) {
    req.flash("error", "OTP code invalid!");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email
  });
  res.cookie("tokenUser", user.token);
  res.redirect("/user/password/reset");
};



module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Reset Password"
  });
};


module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne({
    token: tokenUser,
    status: "active",
    deleted: false
  }, {
    password: md5(password)
  });
  req.flash("success", "Reset Password Success!");

  res.redirect("/");
};


module.exports.profile = async (req, res) => {
  res.render("client/pages/user/profile", {
    pageTitle: "Information User",
  });
};


module.exports.notFriend = async (req, res) => {
  userSocket(req, res);
  const userIdA = res.locals.user.id;


  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map(item => item.userId);
  const users = await User.find({
    $and: [
      { _id: { $ne: userIdA } }, // $ne: not equal
      { _id: { $nin: res.locals.user.requestFriends } }, // $nin: not in
      { _id: { $nin: res.locals.user.acceptFriends } }, // $nin: not in
      { _id: { $nin: friendsListId } }, // $nin: not in
    ],
    deleted: false,
    status: "active"
  }).select("id fullName avatar");

  res.render("client/pages/user/not-friend", {
    pageTitle: "List User",
    users: users
  });
};






module.exports.request = async (req, res) => {
  userSocket(req, res);
  const users = await User.find({
    _id: { $in: res.locals.user.requestFriends },
    deleted: false,
    status: "active"
  }).select("id fullName avatar");
  res.render("client/pages/user/request", {
    pageTitle: "List Request",
    users: users
  });
};


module.exports.accept = async (req, res) => {
  userSocket(req, res);
  const users = await User.find({
    _id: { $in: res.locals.user.acceptFriends },
    deleted: false,
    status: "active"
  }).select("id fullName avatar");
  res.render("client/pages/user/accept", {
    pageTitle: "List Accept",
    users: users
  });
};






module.exports.friends = async (req, res) => {
  // const userIdA = res.locals.user.id;
  const friendsList = res.locals.user.friendsList;
  const users = [];
  for (const user of friendsList) {
    const infoUser = await User.findOne({
      _id: user.userId,
      deleted: false,
      status: "active"
    });
    users.push({
      id: infoUser.id,
      fullName: infoUser.fullName,
      avatar: infoUser.avatar,
      statusOnline: infoUser.statusOnline,
      roomChatId: user.roomChatId
    });
  }
  console.log(users);
  // const users = await User.find({
  //   _id: { $in: friendsListId },
  //   deleted: false,
  //   status: "active"
  // }).select("id fullName avatar statusOnline");
  res.render("client/pages/user/friends", {
    pageTitle: "List Friends",
    users: users
  });
};