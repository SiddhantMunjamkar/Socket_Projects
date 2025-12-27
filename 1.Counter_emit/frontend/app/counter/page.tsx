"use client";

import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [counter, setCounter] = React.useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket only once
    socketRef.current = io("http://localhost:3001");
    const socket = socketRef.current;

    const intervalid = setInterval(() => {
      socket.emit("counter:increment");
    }, 1000);

    socket.on("counter:update", (newCounter: number) => {
      setCounter((prevCounter) => {
        if (newCounter > 10) {
          clearInterval(intervalid);

          return prevCounter;
        }
        return newCounter;
      });
    });

    return () => {
      socket.off("counter:update");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-white text-black font-sans">
      <h1 className="text-4xl font-bold">Counter</h1>
      <p className="text-2xl">current time is: {counter}</p>
      {/* <button
        className=" px-9 h-9 py-2 bg-primary text-primary-foreground hover:bg-gray-400 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        onClick={() => socketRef.current?.emit("counter:increment")}
      >
        Increment
      </button> */}
    </div>
  );
}
