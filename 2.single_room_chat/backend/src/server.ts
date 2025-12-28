import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id.slice(0, 5));

  // Send welcome message to the newly connected client
  socket.emit("message", {
    user: "System",
    message: "Welcome to the chat!",
    timestamp: new Date().toISOString(),
  });

  socket.on("chat:message", (data: Message) => {
    console.log(`Message`, data);

    // broadcast the message to all connected clients
    io.emit("chat:message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Server is running on http://localhost:3000");
});
