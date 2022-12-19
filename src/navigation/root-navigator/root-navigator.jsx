import { createStackNavigator } from '@react-navigation/stack';

import { BottomNavigator } from '../bottom-navigator';

import { LogoTitle } from '../../components';
import { useAuth } from '../../hooks';
import {
  ChannelListScreen,
  ChannelScreen,
  DashboardScreen,
  SettingsScreen,
  SignInScreen,
  WidgetScreen,
  GameTrackerScreen,
  GenerationTournamentScreen,
  ActiveTmGamesScreen
} from '../../screens';

const Stack = createStackNavigator();

function RootNavigator() {
  const { isSignedIn } = useAuth();

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
          component={SignInScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export { RootNavigator };
