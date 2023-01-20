import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { api } from '../libs';
import { messages } from '../utils';

const getUsers = () => api.v1.get('/users', {
  limit: 100
});


const useUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  

  useFocusEffect(
    useCallback(() => {
      async function fetchUsers() {
        setIsLoading(true);
        try {
         const { data } = await getUsers();

          setUsers(data.data);
        } catch (err) {
          // console.log('err.response :>> ', err.response);
          // console.log('err.response.data :>> ', err.toJSON());
          // console.error(messages.failedToFetch);
        }
        setIsLoading(false);
       
      }
      fetchUsers();
    }, [])
  );


  return {
    isLoading,
    users,
  };
};

export { useUsers };
