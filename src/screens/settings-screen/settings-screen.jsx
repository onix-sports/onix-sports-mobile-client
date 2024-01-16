import { StyleSheet } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import sleep from 'sleep-promise';
import { Button, ScreenWrapper } from '../../components';
import { useAuth, useGlobal } from '../../hooks';
import { useOrganizations } from '../../hooks/use-organizations';

function SettingsScreen() {
  const { confirm, progress } = useGlobal();
  const { selectOrganization } = useOrganizations();

  const {
    session,
    onLogout,
  } = useAuth();

  const { username, fullName, initials } = session;
  const handleSignOutPress = async () => {
    try {
      const confirmed = await confirm({
        message: 'Are you sure you want to sign out?',
      });
      if (confirmed) {
        await progress.show();
        await sleep(1000);
        await onLogout();
      }
    } catch (err) {
      console.error(err.message);
    }
    progress.hide();
  };

  const handleOrganizationPress = () => selectOrganization(null);

  return (
    <ScreenWrapper>
      <List.Section>
        <List.Subheader>My Account</List.Subheader>
        <List.Item
          left={() => (
            <Avatar.Text style={styles.avatar} size={80} label={initials} />
          )}
          title={fullName}
          description={username}
        />
      </List.Section>
          
      <Button
        mode="contained"
        style={styles.signOutButton}
        onPress={handleOrganizationPress}
      >
        Change organization
      </Button>

      <Button
        mode="contained"
        style={styles.signOutButton}
        onPress={handleSignOutPress}
      >
        Sign out
      </Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatar: {
    margin: 8,
  },
  signOutButton: {
    margin: 8,
  },
});

export { SettingsScreen };
