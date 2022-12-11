import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { baseApi } from '../libs';
import { messages } from '../utils';

const getLeaderboard = () => baseApi.get('/statistics/leaderboard', {
  params: {
    dateFrom: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).getTime()
  }
});

const useLeaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchLeaderboard() {
        setIsLoading(true);
        try {
         const { data } = await getLeaderboard();

          setLeaderboard(data);
        } catch (err) {
          console.log('err :>> ', err);
          console.error(messages.failedToFetch);
        }
        setIsLoading(false);
      }
      fetchLeaderboard();
    }, [])
  );


  return {
    isLoading,
    leaderboard,
  };
};

export { useLeaderboard };
