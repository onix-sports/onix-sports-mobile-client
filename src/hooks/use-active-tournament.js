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

const useActiveTournament = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [opened, setOpened] = useState(null);
  const [closed, setClosed] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchTournament() {
        setIsLoading(true);
        try {
          const [opened, closed] = await Promise.all([
            getTournament(), 
            getTournament(tournamentsStatuses.CLOSED)
          ]);

          setOpened(opened.data?.[0] || null)
          setClosed(closed.data?.[0] || null)

        } catch (err) {
          console.error(messages.failedToFetch);
        }
        setIsLoading(false);
      }
      fetchTournament();
    }, [])
  );


  return {
    isLoading,
    opened,
    closed
  };
};

export { useActiveTournament };
