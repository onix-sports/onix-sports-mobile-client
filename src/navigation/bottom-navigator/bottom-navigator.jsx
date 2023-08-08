import * as React from 'react';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';
import { Platform } from 'react-native';

import { Leaderboard } from '../../screens/leaderboard-screen';
import { NavigationProvider } from '../../contexts';
import { ActiveTournaments } from '../../screens'

import { IconButton, Menu } from 'react-native-paper';
import { ScreenWrapper } from '../../components';
import { useAuth, useDisclose } from '../../hooks';
import { useOrganizations } from '../../hooks/use-organizations';

const MusicRoute = () => <Text>In Development ...</Text>;

const NotificationsRoute = () => <Text>In Development ...</Text>;

const BottomNavigator = ({ navigation, route }) => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'leaderboard', title: 'Leaderboard', icon: 'scoreboard' },
    { key: 'activeGames', title: 'Tournaments', icon: 'soccer' },
    { key: 'userGrow', title: 'My Grow', icon: 'chart-donut-variant' },
  ]);
  const { session } = useAuth();
  const { organization } = useOrganizations();

  React.useEffect(() => {
    if (route.params?.active) {
      setIndex(route.params?.active)
    }

  }, [route.params?.active])

  const renderScene = BottomNavigation.SceneMap({
    home: MusicRoute,
    leaderboard: Leaderboard,
    activeGames: ActiveTournaments,
    userGrow: NotificationsRoute,
  });

   const {
    isOpen: isMenuOpen,
    onClose: onMenuClose,
    onToggle: onMenuToggle,
  } = useDisclose();

 React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={isMenuOpen}
          onDismiss={onMenuClose}
          anchor={
            <IconButton
              icon={global.MORE_ICON}
              size={24}
              onPress={onMenuToggle}
            />
          }
        >
          <Menu.Item
            title="Settings"
            onPress={() => {
              navigation.navigate('Settings');
              onMenuClose();
            }}
          />
          {organization.creatorId === session._id && (
            <Menu.Item
              title="Organization"
              onPress={() => {
                navigation.navigate('OrganizationSettings');
                onMenuClose();
              }}
            />
          )}
        </Menu>
      ),
    });
  }, [navigation, isMenuOpen, onMenuClose, onMenuToggle]);

  return (
    <ScreenWrapper withScrollView={false}>
      <NavigationProvider rootNav={navigation} setBottomNav={setIndex}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ backgroundColor: theme.colors.background, borderTopColor: theme.colors.text, borderTopWidth: 0.5, flex: Platform.OS === 'ios' ? 0.07 : 0.08 }}
          activeColor={theme.colors.text}
          inactiveColor={theme.colors.text}
        />
      </NavigationProvider>
    </ScreenWrapper>
  );
};

export { BottomNavigator };