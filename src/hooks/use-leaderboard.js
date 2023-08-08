import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { api } from '../libs';
import { messages } from '../utils';

const getLeaderboard = (organization) => api.v1.auth().get('/statistics/leaderboard', {
  params: {
    dateFrom: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1),
    organization
  }
});

const useLeaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchLeaderboard(statusSetter) {
        statusSetter(true);
        try {
          const { data } = await getLeaderboard();

          setLeaderboard(data.data);
        } catch (err) {
          console.log('err :>> ', err.response.data);
          console.error(messages.failedToFetch);
        }
        statusSetter(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard(setIsLoading);
    }, [])
  );

  const onRefresh = useCallback(() => {
    fetchLeaderboard(setIsRefreshing);
  }, []);

  return {
    isLoading,
    leaderboard,
    onRefresh,
    isRefreshing
  };
};

export { useLeaderboard };
