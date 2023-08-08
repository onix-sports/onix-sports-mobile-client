import { useFocusEffect, useNavigation  } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { api } from '../libs';
import { messages } from '../utils';
import { useOrganizations } from './use-organizations';

const tournamentsStatuses = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
}

const getTournaments = (status, organization) => api.v1.auth().get('/tournaments', {
  params: {
    status,
    limit: 100,
    organization
  }
});

const postTournament = (players, organization) => api.v1.auth().post('/tournaments/generate', { players, organization });

const patchCloseTournament = (id) => api.v1.auth().patch('/tournaments/close', { id });

const useActiveTournaments = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTournaments, setActiveTournaments] = useState([]);

  async function fetchTournaments(statusSetter) {
        statusSetter(true);
        try {
          const { data } = await getTournaments(tournamentsStatuses.OPENED);

          setActiveTournaments([...data.data]);

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
      setActiveTournaments([ data.data, ...activeTournaments ]);

      if (redirect) {
        navigation
          .navigate('ActiveTmGames', { 
            id: data.data.tournament._id,
            games: data.data.games
          });
      }

      return data.data;
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
