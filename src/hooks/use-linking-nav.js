import { useFocusEffect, useNavigation  } from '@react-navigation/native';
import { useCallback, useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { useAuth } from './use-auth';
import { api } from '../libs';
import { messages, forOs } from '../utils';

const useLinkingNav = () => {
  const navigation = useNavigation();
  const { onLoginOauth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOpenURL = async (event) => { // D

      const {path, queryParams} = Linking.parse(event.url);
      
      switch (path) {
        case 'sign-in-oauth':
          onLoginOauth(queryParams)

          await forOs().ios(() => WebBrowser.dismissBrowser()).val()
          break;
      
        default:
          break;
      }
    }

    Linking.addEventListener('url', handleOpenURL);

    return () => {
      Linking.remove && Linking.remove('url', handleOpenURL);
    }
  }, []);

  return {
    isLoading,
  };
};

export { useLinkingNav };
