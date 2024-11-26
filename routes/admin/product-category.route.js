const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const controller = require('../../controllers/admin/product-category.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');
router.get('/', controller.index);
router.get('/create', controller.createProductCategory);
router.post('/create',upload.single('thumbnail') ,uploadCloud.uploadSingle, controller.createProductCategoryPost);
router.get('/edit/:id', controller.editProductCategory);
router.patch('/edit/:id', upload.single('thumbnail') ,uploadCloud.uploadSingle, controller.editProductCategoryPatch);

module.exports = router;