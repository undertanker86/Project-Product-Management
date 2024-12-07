const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");
router.get("/", userMiddleware.requireAuth ,controller.index);
router.post("/", userMiddleware.requireAuth ,controller.orderPost);
router.get("/success/:id", userMiddleware.requireAuth ,controller.success);
module.exports = router;