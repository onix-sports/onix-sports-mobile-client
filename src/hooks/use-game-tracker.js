import { ws } from '../libs';
import { messages } from '../utils';

export const GameStatus = {
  DRAFT: 'DRAFT',
  STARTED: 'STARTED',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  UNPAUSED: 'UNPAUSED',
}

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
