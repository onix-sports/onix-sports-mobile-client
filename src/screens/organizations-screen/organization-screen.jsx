import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Button } from '../../components';
import { ScreenWrapper } from '../../components';
import { useOrganizations } from '../../hooks/use-organizations';
import { Avatar, Card, FAB, IconButton, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../libs';

function OrganizationScreen() {
    const { 
        selectOrganization, 
        organizations, 
        invites,
        acceptInvite,
        declineInvite,
        isRefreshing,
        onRefresh
    } = useOrganizations();
    const navigation = useNavigation();

    return (
        <View 
            style={{
                height: '100%', 
                position: 'relative'
            }}>
            <ScreenWrapper
                withScrollView={true} 
                isRefreshing={isRefreshing} 
                onRefresh={onRefresh}>
                {organizations.map((organization, index) => (
                    <TouchableHighlight 
                        onPress={() => selectOrganization(organization)}
                        key={index}
                    >
                        <Card.Title 
                            title={organization.title}
                            key={index}
                            left={(props) => <Avatar.Icon {...props} icon="account-group" />}>
                        </Card.Title>
                    </TouchableHighlight>
                ))}

                {invites.map((invite, index) => (
                    <Card.Title 
                        title={invite.organization.title}
                        key={index}
                        left={(props) => <Avatar.Icon {...props} icon="account-plus" />}
                        right={(props) => (
                            <Card.Actions {...props}>
                                <IconButton 
                                    onPress={() => acceptInvite(invite._id)}
                                    icon="check-bold"
                                    style={{
                                        backgroundColor: '#77dd77',
                                    }}>
                                        Accept
                                </IconButton>
                                <IconButton
                                    onPress={() => declineInvite(invite._id)}
                                    icon="close-thick"
                                    style={{
                                        backgroundColor: '#c2524a',
                                    }}>
                                        Decline
                                </IconButton>
                            </Card.Actions>
                        )}>
                    </Card.Title>
                ))}

                <Button
                    onPress={() => navigation.navigate('OrganizationJoin')}
                    style={{
                        marginTop: 16,
                    }}
                    icon="plus">
                    Join
                </Button>
            </ScreenWrapper>
            
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('OrganizationCreation')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 32,
        bottom: 48,
    }
  });

export { OrganizationScreen };
