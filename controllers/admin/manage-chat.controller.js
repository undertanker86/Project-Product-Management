const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
const Account = require("../../models/account.model");
const Chat = require("../../models/chat.model");
const streamUploadHelper = require('../../helpers/streamUpload.helper');

module.exports.index = async (req, res) => {
  const userId  = res.locals.user.id

  const rooms = await RoomChat.find({
    users: { $elemMatch: { userId: userId } }
  });

  const usersInRooms = [];
  rooms.forEach(room => {
    room.users.forEach(user => {
      if (user.userId !== userId) {
        usersInRooms.push({
          userId: user.userId,
          roomChatId: room.id,
        }); // Lấy userId khác với userId của bạn
      }
    });
  });
 

  // Loại bỏ các user trùng lặp
  const uniqueUsers = [...new Set(usersInRooms)];
  console.log("Users in rooms:", uniqueUsers);
  const users =  await User.find({
    _id: { $in: uniqueUsers.map(user => user.userId) },
    deleted: false,
    status: "active"
  })
  for (i = 0; i < uniqueUsers.length; i++) {

    uniqueUsers[i].fullName = users[i].fullName;
      }
  console.log("Unique users:", uniqueUsers);

  // console.log("Unique users:", uniqueUsers);
    res.render("admin/pages/manage-chats/index", {
      pageTitle: "Manage",
      users: uniqueUsers,
      // usersName: users
    });
    
}

module.exports.chat = async (req, res) => {
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
    const infoUser = await User.findOne({
        _id: chat.userId,
        deleted: false
    });
    chat.fullName = infoUser.fullName;
}
  res.render("admin/pages/manage-chats/chat", {
    pageTitle: "Chat",
    chats: chats
  });
}