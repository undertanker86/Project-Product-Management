import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

var socket = io();
socket.on('connect', () => {
  console.log("Socket connected with id:", socket.id); // In socket.id khi kết nối thành công
});

// Client send message
const formChat = document.querySelector(".chat .inner-form");
if(formChat){

    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {multiple: true, maxFileCount: 6});

    formChat.addEventListener("submit", function(e){
        e.preventDefault();
        const content = formChat.content.value;
        const images = upload.cachedFileArray || [];
        if(content || images.length > 0){
            const data = {
                content: content,
                images: images
            }
            socket.emit("CLIENT_SEND_MESSAGE", data);
            formChat.content.value = "";
            upload.resetPreviewPanel();
        }

    });
}

// Server return message
socket.on("SERVER_RETURN_MESSAGE", function(data){
    // console.log("CHECK");
    const myId = document.querySelector(".chat").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const div = document.createElement("div");
    let htmlFullName = "";
    if(myId == data.userId) {
      div.classList.add("inner-outgoing");
    } else {
      div.classList.add("inner-incoming");
      htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }

    let htmlContent = "";
    if(data.content) {
      htmlContent = `
        <div class="inner-content">${data.content}</div>
      `;
    }
    let htmlImages = "";
    if(data.images.length > 0) {
      htmlImages += `<div class="inner-images">`;
      for (const image of data.images) {
        htmlImages += `<img src="${image}" />`;
      }
      htmlImages += `</div>`;
    }

    div.innerHTML = `
      ${htmlFullName}
      ${htmlContent}
      ${htmlImages}
    `;
    const elementListTyping = document.querySelector(".chat .inner-list-typing");
    body.insertBefore(div,elementListTyping );
    socket.emit("CLIENT_SEND_TYPING", false);
    body.scrollTop = body.scrollHeight;
    new Viewer(div);
});




const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;

    new Viewer(bodyChat);
}


// Show Icon
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const buttonIcon = document.querySelector('.chat .inner-form .button-icon');
  const tooltip = document.querySelector('.tooltip');

  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  })

  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  emojiPicker.addEventListener('emoji-click', event => {
    inputChat.value = inputChat.value + event.detail.unicode;
  });

  var timeOutTyping;

  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", true);
    clearTimeout(timeOutTyping);

    timeOutTyping = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", false);
    }, 3000)
  })
}
// End Show Icon

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    // console.log(data);
    if(data.type) {
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

      if(!existBoxTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        // console.log(data.fullName);
        elementListTyping.appendChild(boxTyping);

        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
      if(existBoxTyping) {
        elementListTyping.removeChild(existBoxTyping);
      }
    }
  })
}
// End SERVER_RETURN_TYPING
// Chức năng chat admin

// const chatLink = document.querySelector('.chat-admin');
// if (chatLink) {
//     chatLink.addEventListener('click', function (event) {
//         console.log("Clicked on chat link"); // Kiểm tra click event
//         event.preventDefault();
//         console.log("Emitting CLIENT_CHAT_ADMIN"); // Kiểm tra trước khi emit
//         socket.emit("CLIENT_CHAT_ADMIN", "1");
//     });
// }
const listBtnChatCSR = document.querySelectorAll("[btn-chat-csr]");
if(listBtnChatCSR.length > 0) {
  listBtnChatCSR.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-chat-csr");
      // button.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_CHAT_ADMIN", userIdB);
    })
  })
}
// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-add-friend");
      button.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng gửi yêu cầu
// Chức năng gửi yeu cau admin



// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-cancel-friend");
      button.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng hủy gửi yêu cầu


// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-refuse-friend");
      button.closest(".box-user").classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng từ chối kết bạn


// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-accept-friend");
      button.closest(".box-user").classList.add("accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeUserAccept = document.querySelector(`[badge-user-accept="${data.userIdB}"]`);
  if(badgeUserAccept) {
    badgeUserAccept.innerHTML = data.length;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS



// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
  const listAcceptFriends = document.querySelector(`[list-accept-friends="${data.userIdB}"]`);
  if(listAcceptFriends) {
    const newUser = document.createElement("div");
    newUser.classList.add("col-6");
    newUser.setAttribute("user-id", data.userIdA);
    newUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.fullNameA}" />
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.fullNameA}</div>
          <div class="inner-buttons">
            <button 
              class="btn btn-sm btn-primary mr-1"
              btn-accept-friend="${data.userIdA}"
            >
              Accept
            </button>
            <button
              class="btn btn-sm btn-secondary mr-1"
              btn-refuse-friend="${data.userIdA}"
            >
              Delete
            </button>
            <button 
              class="btn btn-sm btn-secondary mr-1" 
              btn-deleted-friend="" 
              disabled=""
            >
              Deleted
            </button>
            <button 
              class="btn btn-sm btn-primary mr-1" 
              btn-accepted-friend="" 
              disabled=""
            >
              Accepted
            </button>
          </div>
        </div>
      </div>
    `;
    listAcceptFriends.appendChild(newUser);
    // Chấp nhận kết bạn
    const btnAcceptFriend = newUser.querySelector("[btn-accept-friend]");
    btnAcceptFriend.addEventListener("click", () => {
      btnAcceptFriend.closest(".box-user").classList.add("accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", data.userIdA);
    })
    // Không chấp nhận kết bạn
    const btnRefuseFriend = newUser.querySelector("[btn-refuse-friend]");
    btnRefuseFriend.addEventListener("click", () => {
      btnRefuseFriend.closest(".box-user").classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", data.userIdA);
    })
  }

    // Xóa A khỏi danh sách người dùng của B
  const listNotFriends = document.querySelector(`[list-not-friends="${data.userIdB}"]`);
  if(listNotFriends) {
    const userA = listNotFriends.querySelector(`[user-id="${data.userIdA}"]`);
    if(userA) {
      listNotFriends.removeChild(userA);
    }
  }
})
// End SERVER_RETURN_INFO_ACCEPT_FRIENDS



// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // userIdB để tìm vào danh sách của B
  // userIdA để xóa A khỏi giao diện của B
  const listAcceptFriends = document.querySelector(`[list-accept-friends="${data.userIdB}"]`);
  if(listAcceptFriends) {
    const userA = listAcceptFriends.querySelector(`[user-id="${data.userIdA}"]`);
    if(userA) {
      listAcceptFriends.removeChild(userA);
    }
  }
})
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND


// SERVER_RETURN_STATUS_ONLINE_USER
socket.on("SERVER_RETURN_STATUS_ONLINE_USER", (data) => {
  const listFriend = document.querySelector("[list-friend]");
  if(listFriend) {
    const user = listFriend.querySelector(`[user-id="${data.userId}"]`);
    if(user) {
      const status = user.querySelector("[status]");
      status.setAttribute("status", data.statusOnline);
    }
  }
})
// End SERVER_RETURN_STATUS_ONLINE_USER

socket.on("SERVER_RETURN_CREATE_CHATADMIN_FRIENDS", (data) => {
  console.log(data);
  window.location.href = `http://localhost:3000/chat/${data.roomChatId}`;
})


socket.on("SERVER_RETURN_EXISTING_CHATADMIN_FRIENDS", (data) => {
  console.log(data);
  window.location.href = `http://localhost:3000/chat/${data.roomChatId}`;
})