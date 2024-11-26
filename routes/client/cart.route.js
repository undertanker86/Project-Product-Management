const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const middleware = require("../../middlewares/client/cart.middleware");
router.post("/add/:id", controller.addPost);
router.get("/", controller.index);
router.get("/delete/:id", controller.delete);
router.patch("/update", controller.update);
module.exports = router;