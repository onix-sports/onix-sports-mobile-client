import { Manager } from "socket.io-client";
import Constants from 'expo-constants';

const manager = new Manager('http://localhost:3010', {
  reconnectionDelayMax: 10000,
  transports: ['websocket']
});

export { manager as io };

// const socket = manager.socket("/my-namespace", {
//   auth: {
//     token: "123"
//   }
// });