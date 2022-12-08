import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

// import { io } from '../libs';
import { io } from "socket.io-client";
import { messages } from '../utils';

export const GameStatus = {
  DRAFT: 'DRAFT',
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  UNPAUSED: 'UNPAUSED',
}


const useGameTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameSocket, setGameSocket] = useState(null);
  const [games, setGames] = useState({});

  const initGameSocket = (id, cb) => {
    if (!gameSocket) {
      const socket = io("wss://onix-sports-old.herokuapp.com", {
        transports: ['websocket']
      });

      setGameSocket(socket);
      console.log('socket :>> ', socket);
      setIsLoading(true);

      socket.on("connect", () => {
        console.log('connect :>> ');
        socket.emit('data', { id });

        if (cb) cb(socket)
      });
      socket.on("data", (data) => {
        if (isLoading) {
          setIsLoading(false);
        }

        setGames({ ...games, [id]: { ...data } });
      });
      socket.on('finished', ({ info }) => { console.log('info :>> ', info); });
      socket.on("disconnect", (reason) => {
        console.log('reason :>> ', reason);
        if (reason === "io server disconnect") {
          socket.connect();
        }

        console.error(messages.failedToFetch);
      });

      socket.on("exception", (error) => {
        console.log('error222 :>> ', error.message);
        console.error(messages.failedToFetch);
      });

      socket.on("connect_error", (error) => {
        console.log('error111 :>> ', error.message);
        console.error(messages.failedToFetch);
      });

      return
    }

    if (!gameSocket.connected) {
      return gameSocket.connect();
    }

    gameSocket.emit('data', { id });    
  }

  const forGame = (id, cb) => {
    const game = games[id];

    if (!game || !gameSocket?.connected) {
     return initGameSocket(id, cb)
    }

    cb(gameSocket)
  }

  const start = (id) => {
    forGame(id, (socket) => {
      socket.emit('start', { id });
    })
  }

  const goal = (id, { playerId, enemyId }) => {
    forGame(id, (socket) => {
      socket.emit('goal', { id, playerId, enemyId });
    })
  }

  const swap = (id, playerId) => {
    forGame(id, (socket) => {
      socket.emit('swap', { id, playerId});
    })
  }

  const pause = (id) => {
    forGame(id, (socket) => {
      socket.emit('pause', { id });
    })
  }

  const cancel = (id, actionId) => {
    forGame(id, (socket) => {
      socket.emit('cancel', { id, actionId});
    })
  }

  const initGameController = (id) => {
    const game = games[id];
    if (!game || game.status === GameStatus.DRAFT) {
      start(id);
    }
    

    return {
      start: () => start(id),
      goal: (playerId, enemyId) => goal(id, { playerId, enemyId }),
      swap: (playerId) => swap(id, playerId),
      pause: () => pause(id),
      cancel: (actionId) => cancel(id, actionId)
    }
  }


  return {
    isLoading,
    initGameSocket,
    games,
    start,
    goal,
    swap,
    pause,
    cancel,
    initGameController,
    GameStatus
  };
};

export { useGameTracker };
