import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const useDimensions = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const dimensionListener = Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen');

      const isPortrait = dim.height >= dim.width;

      setIsPortrait(isPortrait);
      setIsLandscape(!isPortrait);
    });

    return () => {
      dimensionListener.remove();
    }
  }, []);

  return {
    isPortrait,
    isLandscape
  };
};

export { useDimensions };
