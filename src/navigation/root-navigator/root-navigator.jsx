import { createStackNavigator } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, Linking } from 'react-native';

import { BottomNavigator } from '../bottom-navigator';

import { LogoTitle } from '../../components';
import { useAuth, useLinkingNav } from '../../hooks';
import {
  SettingsScreen,
  SignInTelegramScreen,
  GameTrackerScreen,
  GenerationTournamentScreen,
  ActiveTmGamesScreen
} from '../../screens';

const Stack = createStackNavigator();

function RootNavigator() {
  const { isSignedIn } = useAuth();
  useLinkingNav();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Roboto_500Medium',
          fontSize: 17,
        },
      }}
    >
      {isSignedIn ? (
          <Stack.Group>
            <Stack.Screen
              name="Back"
              component={BottomNavigator}
              options={{
                headerTitle: (props) => <LogoTitle {...props} />,
              }}
            />
            <Stack.Screen
              name="GenerationTournament"
              component={GenerationTournamentScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="ActiveTmGames"
              component={ActiveTmGamesScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="GameTracker"
              component={GameTrackerScreen}
              options={{ title: '' }}
            />
          </Stack.Group>
      ) : (
        <Stack.Screen
          name="SignIn"
          component={SignInTelegramScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export { RootNavigator };
