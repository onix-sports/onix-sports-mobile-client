import React, { useState } from 'react';
import { Appearance } from 'react-native';

import { themes } from '../../core';
import { PreferencesContext } from './preferences-context';

function PreferencesProvider({ children }) {

  const [isThemeDark, setIsThemeDark] = useState(true);
  const [isManualy, setManualy] = useState(true);

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(
      (preferences) => {
        console.log('preferences :>> ', preferences);
        if (isManualy) return;

        const {colorScheme: scheme} = preferences;
        setIsThemeDark(scheme === 'dark');
      },
    );

    return () => subscription?.remove();
  }, [setIsThemeDark]);

  

  const theme = isThemeDark ? themes.dark : themes.light;

  const toggleTheme = () => {
    if (!isManualy) {
      setManualy(true);
    }

    setIsThemeDark((value) => !value);
  };



  return (
    <PreferencesContext.Provider
      value={{
        toggleTheme,
        isThemeDark,
        theme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export { PreferencesProvider };
