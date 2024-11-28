import { useState } from "react";
import io, { Socket } from "socket.io-client";

const useSocket = (...args: Parameters<typeof io>) => {
  const [value, _] = useState(() => io(...args));
  const [state, setState] = useState<typeof value | undefined>(undefined);
  value.on("connect", () => setTimeout(() => setState(value), 1000));
  value.on("disconnect", () => setState(undefined));
  return state;
};

const sendSocket = (socket: ReturnType<typeof io>, ...args: Parameters<Socket["emit"]>) => {
  return new Promise<void>((resolve, reject) => {
    const out = setTimeout(() => reject(new Error("timeout")), 1000);
    args[2] = () => {
      clearTimeout(out);
      resolve();
    };
    socket.emit(...args);
  });
};

export { sendSocket, useSocket };
