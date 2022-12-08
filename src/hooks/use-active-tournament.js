import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { baseApi } from '../libs';
import { messages } from '../utils';

const tournamentsStatuses = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
}

const getTournament = (status) => baseApi.get('/tournaments', {
  params: {
    status,
    limit: 1
  }
});

const getGames = (tournament) => baseApi.get('/games', {
  params: {
    tournament
  }
});

const postTournament = (players) => baseApi.post('/tournaments/generate', { players });

const patchCloseTournament = (id) => baseApi.patch('/tournaments/close', { id });

const useActiveTournament = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTournament, setActiveTournament] = useState(null);
  const [activeGames, setActiveGames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchTournament() {
        setIsLoading(true);
        try {
          const { data } = await getTournament(tournamentsStatuses.OPENED);
          if (data?.[0]) {
            setActiveTournament(data[0]);

            const gamesRes = await getGames(data[0]._id);

            setActiveGames(gamesRes.data);
          }

        } catch (error) {

          console.error(messages.failedToFetch);
        }
        setIsLoading(false);
      }
      fetchTournament();
    }, [])
  );

  const createTournament = async (players) => {
    setIsLoading(true);
    try {
      const { data } = await postTournament(players);

      setActiveTournament(data.tournament);
      setActiveGames(data.games)
    } catch (error) {
      console.error(messages.failedToFetch);
    }
    setIsLoading(false);
  };

  const closeTournament = async () => {
    setIsLoading(true);
    try {
      if (!activeTournament) {
        return;
      }
  
      await patchCloseTournament(activeTournament._id);

      setActiveTournament(null);
      setActiveGames([])
    } catch (error) {
      console.error(messages.failedToFetch);
    }
    setIsLoading(false);
  }

  return {
    isLoading,
    activeTournament,
    activeGames,
    createTournament,
    closeTournament
  };
};

export { useActiveTournament };
