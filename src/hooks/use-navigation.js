import { useContext } from 'react';
import { NavigationContext } from '../contexts';

const useNavigation = () => {
  return useContext(NavigationContext);
};

export { useNavigation };
