import { io } from "socket.io-client";
import Constants from 'expo-constants';


const socket = io(Constants.expoConfig.extra.wsUrl, {
  transports: ['websocket']
});

socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
});

function withConnect(cb) {
  if (socket.connected) {
    return cb(socket)
  }

  socket.on("connect", () => {
    cb(socket);
  });
}

function onException(cb) {
  socket.on("exception", cb);
}

const ws = { onException, withConnect, socket };

export { ws };