import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";

const app = express();
app.use(cors());




const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let counter = 0;

io.on("connection", (socket) => {
  console.log("A user connected: id", socket.id);

  // io.emit("message", "welcome to the websocket server");

  // socket.on("message", (data) => {
  //   console.log("message from client", data);
  //   socket.broadcast.emit("message", `message from client ${socket.id}: ${data}`);
  // });

    socket.emit("counter:update", counter);

    socket.on("counter:increment", () => {
      counter++;
      io.emit("counter:update", counter);
    });
    socket.on("counter:decrement", () => {
      counter--;
      io.emit("counter:Update", counter);
    });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


httpServer.listen(3001);
