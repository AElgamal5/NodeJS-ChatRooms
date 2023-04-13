const socket = io();

const chatForm = document.getElementById("chat-form");
//focus when enter the chat room
chatForm.elements.msg.focus();
const chatMsgs = document.querySelector(".chat-messages");

//get userName & room form URL using Qs lib
const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//get room and users in the room
socket.on("roomUsers", ({ room, users }) => {
  outPutRoom(room);
  outPutUsers(users);
});

//emit join room event to send user name and room
socket.emit("joinRoom", { userName, room });

//listen to msgs from the server
socket.on("message", (msg) => {
  console.log(msg);
  outPutMsg(msg);

  //scroll down when receiving msg from server
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message from dom
  const msg = e.target.elements.msg.value;

  //emit the message to the serve
  socket.emit("chatMsg", msg);

  //remove value form input field and stay focus
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output the msg to dom
function outPutMsg(msg) {
  const { userName, text, time } = msg;

  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${userName} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

//change room name
function outPutRoom(room) {
  document.getElementById("room-name").innerText = room;
}

// display users in room
function outPutUsers(users) {
  const parent = document.getElementById("users");
  parent.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.userName;
    parent.appendChild(li);
  });
}
