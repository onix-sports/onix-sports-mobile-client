import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { ws } from '../libs';
// import { io } from "socket.io-client";
import { messages } from '../utils';

export const GameStatus = {
  DRAFT: 'DRAFT',
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  UNPAUSED: 'UNPAUSED',
}

// const useGameTracker = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [gameSocket, setGameSocket] = useState(null);
//   const [games, setGames] = useState({});

//   const initGameSocket = (id, cb) => {
//     if (!gameSocket) {
//       const socket = io("ws://localhost:3010", {
//         transports: ['websocket']
//       });

//       setGameSocket(socket);
//       context.socket = socket;

//       setIsLoading(true);

//       socket.on("connect", () => {
//         console.log('connect :>> ');
//         socket.emit('data', { id });

//         if (cb) cb(socket)
//       });
//       socket.on("data", (data) => {
//         if (isLoading) {
//           setIsLoading(false);
//         }
//         // console.log('data :>> ', data);
// context.games = { ...context.games, [id]: { ...data } }
//         setGames({ ...games, [id]: { ...data } });
//         // console.log('games :>> ', games);
//       });
//       socket.on('finished', ({ info }) => { console.log('info :>> ', info); });
//       socket.on("disconnect", (reason) => {
//         console.log('reason :>> ', reason);
//         if (reason === "io server disconnect") {
//           socket.connect();
//         }

//         // console.error(messages.failedToFetch);
//       });

      // socket.on("exception", (error) => {
      //   console.log('error222 :>> ', error.message);
      //   // console.error(messages.failedToFetch);
      // });

//       socket.on("connect_error", (error) => {
//         console.log('error111 :>> ', error.message);
//         // console.error(messages.failedToFetch);
//       });

//       return
//     }

//     if (!gameSocket.connected) {
//       return gameSocket.connect();
//     }

//     gameSocket.emit('data', { id });    
//   }

//   const forGame = (id, cb) => {
//     const game = games[id];
//     console.log('context :>> ', context);
//     console.log('id for g:>> ', id);
//     console.log('gameSocket?.connected :>> ', gameSocket);
//     console.log('game123 :>> ', games);
//     if (!game || !gameSocket?.connected) {
//      return initGameSocket(id, cb)
//     }

//     cb(gameSocket)
//   }

//   const start = (id) => {
//     forGame(id, (socket) => {
//       socket.emit('start', { id });
//     })
//   }

//   const goal = (id, { playerId, enemyId }) => {
//     forGame(id, (socket) => {
//       socket.emit('goal', { id, playerId, enemyId });
//     })
//   }

//   const swap = (id, playerId) => {
//     forGame(id, (socket) => {
//       socket.emit('swap', { id, playerId});
//     })
//   }

//   const pause = (id) => {
//     forGame(id, (socket) => {
//       socket.emit('pause', { id });
//     })
//   }

//   const cancel = (id, actionId) => {
//     forGame(id, (socket) => {
//       socket.emit('cancel', { id, actionId});
//     })
//   }

//   const initGameController = (id) => {
//     const game = games[id];
//     if (!game || game.status === GameStatus.DRAFT) {
//       start(id);
//     }
    

//     return {
//       start: () => start(id),
//       goal: (playerId, enemyId) => goal(id, { playerId, enemyId }),
//       swap: (playerId) => swap(id, playerId),
//       pause: () => pause(id),
//       cancel: (actionId) => cancel(id, actionId)
//     }
//   }


//   return {
//     isLoading,
//     initGameSocket,
//     games,
//     start,
//     goal,
//     swap,
//     pause,
//     cancel,
//     initGameController,
//     GameStatus
//   };
// };

const useGameTracker = () => {
  const { onException, withConnect } = ws;


  const start = (id) => {
    withConnect((socket) => {
      socket.emit('start', { id });
    });
  }

  const goal = (id, { playerId, enemyId }) => {
    withConnect((socket) => {
      socket.emit('goal', { id, playerId, enemyId });
    })
  }

  const swap = (id, playerId) => {
    withConnect((socket) => {
      socket.emit('swap', { id, playerId});
    })
  }

  const pause = (id) => {
    withConnect((socket) => {
      socket.emit('pause', { id });
    })
  }

  const cancel = (id, actionId) => {
    withConnect((socket) => {
      socket.emit('cancel', { id, actionId});
    })
  }

  const onUpdate = (id, cb, status) => {
    withConnect((socket) => {
      socket.on("data", (data) => {
        if (data.id === id) {
          cb(data);
        }
      });

      if (status === GameStatus.DRAFT) {
        return socket.emit('start', { id });
      }

      socket.emit('data', { id });
    });

    onException((error) => {
      console.log('error :>> ', error);
    })
  }

  const initGameController = (id, status) => {

    return {
      start: () => start(id),
      goal: (playerId, enemyId) => goal(id, { playerId, enemyId }),
      swap: (playerId) => swap(id, playerId),
      pause: () => pause(id),
      cancel: (actionId) => cancel(id, actionId),
      onUpdate: (cb) => onUpdate(id, cb, status),
    
    }
  }


  return {
    initGameController,
    GameStatus
  };
};

export { useGameTracker };
