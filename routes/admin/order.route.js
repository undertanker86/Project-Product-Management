const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/order.controller.js');
router.get('/', controller.index);
router.get('/:id', controller.orderDetail);

module.exports = router;