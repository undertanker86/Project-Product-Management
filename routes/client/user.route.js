const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");


router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", controller.resetPasswordPost);
router.get(
    "/profile",
    userMiddleware.requireAuth,
    controller.profile
  );
router.post(
    "/profile",
    userMiddleware.requireAuth,
    controller.profilePost
  );
router.get("/not-friend", userMiddleware.requireAuth, controller.notFriend);
router.get("/request", userMiddleware.requireAuth, controller.request);
router.get("/accept", userMiddleware.requireAuth, controller.accept);

router.get(
  "/friends",
  userMiddleware.requireAuth,
  controller.friends
);

module.exports = router;