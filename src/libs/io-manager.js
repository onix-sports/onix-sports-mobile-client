import { io } from "socket.io-client";
import Constants from 'expo-constants';


const socket = io(Constants.expoConfig.extra.wsUrl, {
  transports: ['websocket'],
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTU2ZDIwYzNhMTJjNTAwMTY2ZDk5ZDkiLCJyb2xlIjoiYWRtaW4iLCJvcmdhbml6YXRpb25zIjpbIjY0NTk2NmI2MjE5NWZlNGU5OTE4NDlkNCJdLCJ0ZWxlZ3JhbSI6eyJmaXJzdE5hbWUiOiJLb3JvcCIsInBob3RvVXJsIjoiaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS9ob3d0by9pbWdfYXZhdGFyLnBuZyIsImlkIjo3NTg4ODExNzAsImlzX2JvdCI6ZmFsc2UsImZpcnN0X25hbWUiOiJWbGFkIiwidXNlcm5hbWUiOiJ2a29yb3AiLCJsYW5ndWFnZV9jb2RlIjoicnUifSwiaWF0IjoxNjg0NTMwODExLCJleHAiOjE2ODQ1MzQ0MTF9.nJ02o1GcOlPZUshOJbeqig7_H_Nww2A-26UU9xtjg4o'
  }
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