const express = require('express');
const router = express.Router();
const manageChatController = require('../../controllers/admin/manage-chat.controller');
router.get('/',  manageChatController.index);
router.get('/chat/:roomChatId',  manageChatController.chat);
module.exports = router;