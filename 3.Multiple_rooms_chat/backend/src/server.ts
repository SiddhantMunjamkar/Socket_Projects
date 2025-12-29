import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

interface ChatMessage {
  room: string;
  name: string;
  text: string;
  timestamp: string;
}

const app = express();
app.use(cors());
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("room:join", (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    // Notify the user they joined successfully
    socket.emit("room:joined", room);
  });

  socket.on("chat:message", (data: ChatMessage) => {
    io.to(data.room).emit("chat:message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

httpserver.listen(3001, () => {
  console.log("Server is running on port 3001");
});
