import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    transports: ["websocket"],
    reconnectionAttemp: "Infinity",
    timeout: 10000,
    "force new connection": true,
  };
  return io("http://localhost:5000",options);
};
