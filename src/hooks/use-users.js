import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
// import axios from 'axios';
import { baseApi } from '../libs';
import { messages } from '../utils';

// const defUrl ='https://www.w3schools.com/howto/img_avatar.png';
// let defImgBase64 = null;

const getUsers = () => baseApi.get('/users', {
  limit: 100
});

//  function setPlayersAvatars(player, setPlayer) {
//         if (defImgBase64 && player.avatarUrl === defUrl && player.avatarUrl !== defImgBase64) {
//           return setPlayer({  ...player, avatarUrl: defImgBase64 })
//         }
//         axios.get(player.avatarUrl, 
//             {
//                 responseType:"blob"
//             }).then(res => {
//                 // setTimeout()
//                 const reader = new window.FileReader();
//                 reader.readAsDataURL(res.data); 
//                 reader.onload = function() {
//                     const imageDataUrl = reader.result;

//                     if (!defImgBase64) {
//                       defImgBase64 = imageDataUrl;
//                     }
                    
//                     setPlayer({  ...player, avatarUrl: imageDataUrl })
//                 }
//             })
//             .catch(error => {
//                 setPlayer({  ...player, avatarUrl: defImgBase64 || defUrl })
//             })
//     }

const useUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  

  useFocusEffect(
    useCallback(() => {
      async function fetchUsers() {
        setIsLoading(true);
        try {
         const { data } = await getUsers();
          console.log('data :>> ', data);
          setUsers(data);
          // data.forEach((doc => setPlayersAvatars(doc, (player) => {
          //   return setUsers(users.map(user => {
          //     if (player.name === 'Vlad') {
          //       console.log('player :>> ', player);
          //     }

          //     if (player._id === user._id) {
          //       console.log('player._id === user._id :>> ', player._id === user._id);
          //       console.log('player :>> ', player);
          //       return { ...player }
          //     }

          //     return user;
          //   }))
          // })))
        } catch (err) {
          console.log('err.response.data :>> ', err.toJSON());
          console.error(messages.failedToFetch);
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
