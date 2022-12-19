import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { baseApi } from '../libs';
import { messages } from '../utils';


const getGames = (tournament) => baseApi.get('/games', {
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

            setActiveGames([...gamesRes.data]);
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
