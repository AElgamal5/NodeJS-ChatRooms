const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const msgFormat = require("./utils/message");
const userFns = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const botName = "Bla-Bot";

app.use(express.static(path.join(__dirname, "public")));

//socket
io.on("connection", (socket) => {
  //when new user join
  socket.on("joinRoom", ({ userName, room }) => {
    const user = userFns.join(socket.id, userName, room);
    socket.join(user.room);

    //welcome to current user only
    socket.emit("message", msgFormat(botName, "Welcome to Bla-Bla"));

    //broadcast when user connect (all clients except the connected user)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        msgFormat(botName, `${user.userName} has joined the chat`)
      );

    //send back users in room to update them
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: userFns.roomUsers(user.room),
    });
  });

  //listen form chatMsg
  socket.on("chatMsg", (msg) => {
    const user = userFns.getCurrent(socket.id);

    //emit it back to all clients (in the same room)
    io.to(user.room).emit("message", msgFormat(user.userName, msg));
  });

  //broadcast to all clients (in the same room) when user disconnected
  socket.on("disconnect", () => {
    const user = userFns.leave(socket.id);

    // to avoid error of undefined property
    if (user) {
      io.to(user.room).emit(
        "message",
        msgFormat(botName, `${user.userName} has left the chat`)
      );

      //send back users in room to update them
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: userFns.roomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port: ${PORT}`));
