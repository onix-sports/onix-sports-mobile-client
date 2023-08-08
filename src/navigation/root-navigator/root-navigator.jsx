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
  ActiveTmGamesScreen,
  OrganizationScreen,
  OrganizationSettingsScreen
} from '../../screens';
import { useOrganizations } from '../../hooks/use-organizations';
import { OrganizationCreationScreen } from '../../screens/organizations-screen/organization-creation-screen';
import { OrganizationJoinScreen } from '../../screens/organizations-screen/organization-join-screen';

const Stack = createStackNavigator();

function RootNavigator() {
  const { isSignedIn } = useAuth();
  const { organization: isOrganizationChoosed } = useOrganizations(); 

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
          !isOrganizationChoosed ? (
              <Stack.Group>
                <Stack.Screen
                  name="Organizations"
                  component={OrganizationScreen}
                  options={{ title: '' }}
                />

                <Stack.Screen
                  name="OrganizationCreation"
                  component={OrganizationCreationScreen}
                  options={{ title: '' }}
                />

                <Stack.Screen
                  name="OrganizationJoin"
                  component={OrganizationJoinScreen}
                  options={{ title: '' }}
                />
              </Stack.Group>
            ) : (
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
                  name="OrganizationSettings"
                  component={OrganizationSettingsScreen}
                  options={{ title: 'Organization' }}
                />
                <Stack.Screen
                  name="GameTracker"
                  component={GameTrackerScreen}
                  options={{ title: '' }}
                />
              </Stack.Group>
          )
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
