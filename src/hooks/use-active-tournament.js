import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { api } from '../libs';
import { messages } from '../utils';


const getGames = (tournament) => api.v1.auth().get('/games', {
  params: {
    tournament
  }
});

const useActiveTournamentGames = (id, games) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeGames, setActiveGames] = useState( games || []);

  async function fetchTournamentGames(statusSetter) {
        statusSetter(true);
        try {
            const gamesRes = await getGames(id);

            setActiveGames([...gamesRes.data.data]);
            statusSetter(false);

        } catch (error) {
          console.error(messages.failedToFetch);
        }
        statusSetter(false);
      }

  useFocusEffect(
    useCallback(() => {
      if (activeGames.length) {
        setIsLoading(false)
      } else {
        fetchTournamentGames(setIsLoading);
      }
    }, [])
  );

 

  const onRefresh = useCallback(() => {
    fetchTournamentGames(setIsRefreshing);
  }, []);

  return {
    isLoading,
    isRefreshing,
    onRefresh,
    activeGames
  };
};

export { useActiveTournamentGames };
