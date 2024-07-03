import express from "express";
import { Server } from "socket.io";
import http from "http";
import ACTIONS from "../Frontend/Actions.js";

const port = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = new Server(server);

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port : ${process.env.PORT}`);
});
//We need to know which socket id is for which username we'll add every joined user in this object
//Can be stored in DB
const userSocketMap = {
  //'J4Asnq3PuLCqH9dWAAAF' : 'Vaibhav Shukla'
};

//Function to get all connected clients
function getAllConnectedClients(roomId) {
  //The below method returns a map and we convert and return it in the form of array or empty array.
  //Map this array with the socket id present in userSocketMap with username
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId], //We mapped above
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  //If a user joins we get access to what we emitted in from frontend Editor.jsx
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    //Make this socket id join into the room if room exists it joins if not it creates a new room
    socket.join(roomId);
    //Notify a new user joined so we need to get a list of all the joined users
    //We need to get the list of all the users in the room
    const clients = getAllConnectedClients(roomId);
    //Notify using .to function we're sending actions.joined (someone has joined) and some data
    clients.forEach(({ socketId }) => {
      //We are notifying all connected client
      //We need to listen this Event on our frontend
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      }); //which socket id to be notified including current client
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, value }) => {
    //We've to broadcast to every other apart from us
    //This actions.code change is coming from client
    //We need to get the list of all the users in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { value }); //This is getting send to client through server
  });

  socket.on("disconnecting", () => {
    //Get all rooms

    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      //Get every room and broadcast in every room that socket.id is disconnected to evrey other connected client
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    //Update the usersocketmap
    delete userSocketMap[socket.id];
    //Disconnect from the room
    socket.leave();
  });
});
