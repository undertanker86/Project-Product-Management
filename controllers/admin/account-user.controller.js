const md5 = require('md5');
const Role = require("../../models/role.model");
const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
module.exports.index = async (req, res) => {
    res.render("admin/pages/account-users/create", {
        pageTitle: "Create Account",
      });
}

module.exports.createPost = async (req, res) => {
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
    const creditCardType = "Visa";
    const creditCardNumber = "1234-5678-2323-1111";
    const expMonth = "12";
    const expYear = "22";
    const cvv = "cvv";
    const dataUser = {
        fullName: user.fullName,
        email: user.email,
        password: md5(user.password),
        token: generateHelper.generateRandomString(30),
        status: "active",
        phone: user.phoneNumber,
        address: user.address,  
        card:{
        name: creditCardType,
        number: creditCardNumber,
        expMonth: expMonth,
        expYear: expYear,
        cvv: cvv
        }

    };
    const newUser = new User(dataUser);
    await newUser.save();
    req.flash("success", "Create account success!");
    const subject = "Welcome to Beta – Account Created Successfully!";
    const htmlText = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    
      <h2 style="color: #007BFF;">Dear abcd,</h2>
      
      <p>We are pleased to inform you that your account with <strong>Beta</strong> has been successfully created!</p>
      
      <p><strong>Here are the details of your new account:</strong></p>
      
      <ul>
        <li><strong>Account Email</strong>: makok88187@iminko.com</li>
        <li><strong>Account Password</strong>: 1211212121 (Please make sure to change your password after logging in for the first time.)</li>
      </ul>
      
      <p><strong>For your security, please keep your account details confidential.</strong></p>
    
      <h3 style="color: #007BFF;">Your Credit Card Information (Please review and edit if necessary):</h3>
      <ul>
        <li><strong>Card Type</strong>: Visa</li>
        <li><strong>Card Number</strong>: 1234-5678-2323-1111 (For security reasons, we suggest you do not share this with anyone.)</li>
        <li><strong>Expiration Date</strong>: 12/22</li>
        <li><strong>CVV</strong>: cvv</li>
      </ul>
      
      <h3 style="color: #007BFF;">What’s Next?</h3>
      <ul>
        <li>You can now log in to your account using your email and password.</li>
        <li>Feel free to explore our services and make the most out of your new account.</li>
      </ul>
    
      <p>If you have any questions or need assistance, don’t hesitate to reach out to us at <strong>undertanker86.work@gmail.com</strong>.</p>
      
      <p>Thank you for choosing <strong>Beta</strong>. We look forward to serving you!</p>
      
      <br>
      
      <p>Best regards,</p>
      <p>The Beta Team</p>
    
      <hr style="border: 1px solid #ddd;">
    
    
    </body>
    </html>
    `;
    req.flash("success", "Create account success!");
    sendMailHelper.sendMail(user.email, subject, htmlText);
    res.redirect("/admin/account-users");
}