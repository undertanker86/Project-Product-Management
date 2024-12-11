const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product.controller.js');
const multer  = require('multer');
const upload = multer();
// const upload = multer({ dest: './public/uploads/' })
const validate = require('../../validate/admin/product.validate.js');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/uploads')
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       const fileName = `${Date.now()}-${file.originalname}`;
//       cb(null, fileName)
//     }
//   });

// const upload = multer({ storage: storage })


router.get('/', controller.index);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/delete", controller.deleteProduct);
router.patch("/change-position", controller.changePosition);
router.get('/create', controller.createProduct);
router.post('/create', 
  upload.single('thumbnail'), 
  uploadCloud.uploadSingle,
  validate.createProductPost ,
  controller.createProductPost);
router.get('/edit/:id', controller.editProduct);
router.patch('/edit/:id', upload.single('thumbnail') ,uploadCloud.uploadSingle, validate.createProductPost ,controller.editProductPatch);
router.get('/detail/:id', controller.detailProduct);
router.get('/create/deal', controller.createDeal);
router.post('/create/deal', controller.createDealPost);
module.exports = router;