const express = require('express');
const router = express.Router();
const multer  = require('multer');
// const upload = multer();
// const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');

const controller = require('../../controllers/admin/account-user.controller.js');
router.get('/', controller.index);
router.post('/', controller.createPost);
module.exports = router;