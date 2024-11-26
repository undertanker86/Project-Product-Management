const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');

const controller = require('../../controllers/admin/account.controller.js');
router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',upload.single('avatar')  ,uploadCloud.uploadSingle ,controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',upload.single('avatar')  ,uploadCloud.uploadSingle , controller.editPatch);
router.get("/change-password/:id", controller.changePassword);
router.patch("/change-password/:id", controller.changePasswordPatch);
router.get('/my-profile', controller.myProfile); 
module.exports = router;