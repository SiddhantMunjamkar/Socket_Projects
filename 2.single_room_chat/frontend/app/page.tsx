"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  name: string;
  text: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [joined, setJoined] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    const socket = socketRef.current;

    socket.on("chat:message", (message: Message) => {
      setMessages((prevmsg) => [...prevmsg, message]);
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, []);

  const userset = () => {
    if (!text.trim()) return;
    socketRef.current?.emit("chat:message", {
      name: username,
      text: text,
      timestamp: new Date().toLocaleTimeString(),
    });
    setText("");
  };

  if (!joined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-black">
        <div className="flex flex-col items-center gap-4 p-4">
          <h1 className="text-2xl font-bold">Enter your username</h1>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
          <button
            onClick={() => {
              setJoined(true);
            }}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold font-sans text-black">Single-chat app</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.name === username ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 ${
                msg.name === username
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-80">
                {msg.name}
              </div>
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && userset()}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
          />
          <button
            onClick={userset}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
