import { useFocusEffect, useNavigation  } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { baseApi } from '../libs';
import { messages } from '../utils';

const tournamentsStatuses = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
}

const getTournaments = (status) => baseApi.get('/tournaments', {
  params: {
    status,
    limit: 100
  }
});

const postTournament = (players) => baseApi.post('/tournaments/generate', { players });

const patchCloseTournament = (id) => baseApi.patch('/tournaments/close', { id });

const useActiveTournaments = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTournaments, setActiveTournaments] = useState([]);

  async function fetchTournaments(statusSetter) {
        statusSetter(true);
        try {
          const { data } = await getTournaments(tournamentsStatuses.OPENED);
          setActiveTournaments([...data]);

        } catch (error) {
          console.error(messages.failedToFetch);
        }
        statusSetter(false);
      }

  useFocusEffect(
    useCallback(() => {
      fetchTournaments(setIsLoading);
    }, [])
  );

  const onRefresh = useCallback(() => {
    fetchTournaments(setIsRefreshing);
  }, []);

   const createTournament = async (players, redirect) => {
    setIsLoading(true);
    try {
      const { data } = await postTournament(players);

      setIsLoading(false);
      setActiveTournaments([ data, ...activeTournaments ]);

      if (redirect) {
        navigation
          .navigate('ActiveTmGames', { 
            id: data.tournament,
            games: data.games
          });
      }

      return data;
    } catch (error) {
      console.log('error :>> ', error);
      setIsLoading(false);
      console.error(messages.failedToFetch);

      return null;
    }
  };

  const closeTournament = async (id, redirect) => {
    setIsLoading(true);

    try {
      console.log('id :>> ', id);
      await patchCloseTournament(id);

      setActiveTournaments(activeTournaments.filter((tm => tm._id !== id)));

      if (redirect) {
        navigation
          .navigate('Back', { 
            active: 1
          });
      }

    } catch (error) {
      console.log('error1111 :>> ', error);
      console.error(messages.failedToFetch);
    }

    setIsLoading(false);
  }

  return {
    isLoading,
    isRefreshing,
    onRefresh,
    activeTournaments,
    closeTournament,
    createTournament
  };
};

export { useActiveTournaments };
