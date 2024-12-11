const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
const userSocket = require("../../sockets/client/user.socket");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
// const sendMailHelper = require("../../helpers/sendMail.helper");

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Register Account",
  });
};
module.exports.registerPost = async (req, res) => {
  const user = req.body;
  console.log(user);
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
    status: "active",
    phone: user.phoneNumber,
    address: user.address,  
    card:{
      name: user.creditCardType,
      number: user.creditCardNumber,
      expMonth: user.expMonth,
      expYear: user.expYear,
      cvv: user.cvv
    }

  };
  const newUser = new User(dataUser);
  await newUser.save();
  // res.cookie("tokenUser", newUser.token);
  const subject = "Welcome to Beta – Account Register Successfully!";
  const htmlText =  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created - Welcome to Beta</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      h2 {
        color: #007BFF;
      }
      .footer {
        font-size: 12px;
        color: #aaa;
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
  
    <h2>Dear ${user.fullName},</h2>
  
    <p>We are pleased to inform you that your account with <strong>Beta</strong> has been successfully created!</p>
    
    <p>You can now log in using your email and password to explore our services.</p>
  
    <p>If you have any questions or need assistance, feel free to reach out to us at <strong>undertanker86.work@gmail.com</strong>.</p>
  
    <a href="http://localhost:3000/user/login" class="btn">Log In to Your Account</a>
  
    <br><br>
    <p>Thank you for choosing <strong>Beta</strong>. We look forward to serving you!</p>
  
    <p>Best regards,</p>
    <p>The Beta Team</p>
  
   
  
  </body>
  </html>
  `;

  sendMailHelper.sendMail(user.email, subject, htmlText);
  req.flash("success", "Success Register Account!");
  res.redirect("/user/login");
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
    const text = `Your OTP is: <b>${otp}</b>. OTP code is valid for 5 minutes, please do not provide OTP code to anyone.`;
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

module.exports.profilePost = async (req, res) => {
  const user = req.body;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne({
    token: tokenUser,
    status: "active",
    deleted: false
  }, {
    fullName: user.fullName,
    email: user.email,
    phone: user.phoneNumber,
    address: user.address,
    card:{
      name: user.creditCardType,
      number: user.creditCardNumber,
      expMonth: user.expMonth,
      expYear: user.expYear,
      cvv: user.cvv
    }
  });
  const title = `You just updated your information!`;
  const text=  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Information Update Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding: 20px;
              background-color: #4CAF50;
              color: #ffffff;
              border-radius: 8px 8px 0 0;
          }
          .content {
              padding: 20px;
              color: #333333;
              line-height: 1.6;
          }
          .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #777777;
              border-top: 1px solid #eeeeee;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              background-color: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-size: 16px;
          }
          .button:hover {
              background-color: #45a049;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>Information Update Successful!</h2>
          </div>
          <div class="content">
              <p>Dear ${user.fullName},</p>
              <p>We wanted to let you know that your account information has been successfully updated. Here is a summary of your updated details:</p>
              <ul>
                  <li><strong>Name:</strong> ${user.fullName}</li>
                  <li><strong>Email:</strong> ${user.email}</li>
                  <li><strong>Phone:</strong> ${user.phone}</li>
                  <li><strong>Address:</strong> ${user.address}</li>
                  <li><strong>Credit Card Type:</strong> ${user.creditCardType}</li>
              </ul>
              <p>If any of these details are incorrect or need further adjustment, please feel free to update them at any time via your account settings.</p>
              <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
              <a href="http://localhost:3000/user/profile" class="button">Go to Your Account</a>
          </div>
          <div class="footer">
              <p>&copy; 2024 Beta. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
  sendMailHelper.sendMail(user.email, title, text);
  req.flash("success", "Update Information Success!");
  res.redirect("back");
}

// module.exports.notFriend = async (req, res) => {
//   userSocket(req, res);
//   const userIdA = res.locals.user.id;


//   const friendsList = res.locals.user.friendsList;
//   const friendsListId = friendsList.map(item => item.userId);
//   const users = await User.find({
//     $and: [
//       { _id: { $ne: userIdA } }, // $ne: not equal
//       { _id: { $nin: res.locals.user.requestFriends } }, // $nin: not in
//       { _id: { $nin: res.locals.user.acceptFriends } }, // $nin: not in
//       { _id: { $nin: friendsListId } }, // $nin: not in
//     ],
//     deleted: false,
//     status: "active"
//   }).select("id fullName avatar");

//   res.render("client/pages/user/not-friend", {
//     pageTitle: "List User",
//     users: users
//   });
// };


module.exports.notFriend = async (req, res) => {
  userSocket(req, res);
    const roleTitle =  "CSR";
    const role = await Role.findOne({ title: roleTitle });
    const accounts = await Account.find({ role_id: role._id });
    console.log("ACCOUNTS", accounts);
  // const userIdA = res.locals.user.id;


  // const friendsList = res.locals.user.friendsList;
  // const friendsListId = friendsList.map(item => item.userId);
  // const users = await User.find({
  //   $and: [
  //     { _id: { $ne: userIdA } }, // $ne: not equal
  //     { _id: { $nin: res.locals.user.requestFriends } }, // $nin: not in
  //     { _id: { $nin: res.locals.user.acceptFriends } }, // $nin: not in
  //     { _id: { $nin: friendsListId } }, // $nin: not in
  //   ],
  //   deleted: false,
  //   status: "active"
  // }).select("id fullName avatar");
  res.render("client/pages/user/not-friend", {
    pageTitle: "List User",
    users: accounts
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

// module.exports.chatAdmin = async (req, res) => {
//   userSocket(req, res);
// };







module.exports.friends = async (req, res) => {
  // const userIdA = res.locals.user.id;
  console.log("RESPRONSE LOCALS")
  // console.log(res.locals)
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
  // console.log(users);
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




