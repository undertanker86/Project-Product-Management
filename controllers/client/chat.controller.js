const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const streamUploadHelper = require('../../helpers/streamUpload.helper');
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    _io.once('connection', (socket) => {
        // Client send message to server
        socket.join(req.params.roomChatId);
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            // _io.emit("SERVER_SEND_MESSAGE", data);
            const images = [];
            for (const item of data.images){
              const result = await streamUploadHelper.streamUpload(item);
              images.push(result.url);
            }
            const dataChat = {
                userId: res.locals.user.id,
                content: data.content,
                images: images,
                roomChatId: req.params.roomChatId,
            };
            const chat = new Chat(dataChat);
            await chat.save();
            _io.to(req.params.roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: res.locals.user.id,
                fullName: res.locals.user.fullName,
                content: data.content,
                images: images,
              })
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
          socket.broadcast.to(req.params.roomChatId).emit("SERVER_RETURN_TYPING", {
              userId: res.locals.user.id,
              fullName: res.locals.user.fullName,
              type: type
            })
          })
        });
        

    const chats = await Chat.find({
        roomChatId: req.params.roomChatId,
        deleted: false
    })
    
    for(const chat of chats){
        const infoUser = await Account.findOne({
            _id: chat.userId,
            deleted: false
        });
        // chat.fullName = infoUser.fullName;
    }
    res.render("client/pages/chat/index", {
      pageTitle: "Chat",
      chats: chats
    });
  };