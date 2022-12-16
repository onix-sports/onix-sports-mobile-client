import { Title, Button, IconButton, Divider, List, useTheme, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import {  View  } from 'react-native';
import * as React from 'react';

import { ScreenWrapper } from '../../components';

const GameActionTypes = {
    RGOAL: {
        title: 'Goal',
        icon: 'volleyball'
    },
    MGOAL: {
        title: 'Goal',
        icon: 'soccer'
    },
    ARGOAL: {
        title: 'Autogoal',
        icon: 'emoticon-cry'
    },
    AMGOAL: {
        title: 'Autogoal',
        icon: 'emoticon-cry'
    },
    SWAP: {
        title: 'Swap',
        icon: 'account-convert'
    },
    PAUSE: {
        title: 'Pause',
        icon: 'timer-sand-paused'
    },
    RESUME: {
        title: 'Resume',
        icon: 'timer-sand'
    },
    START: {
        title: 'Start',
        icon: 'play-speed'
    },
    FINISH: {
        title: 'Finish',
        icon: 'timer-sand-complete'
    },
}

function GameActivitiesList({ activities, onDelete, canMakeAction  }) {
    const theme = useTheme();
    const [removeAction, setRemoveAction] = React.useState(null);
    const showedDialog = !!removeAction

    return (
        <>
            <View> 

                    <Portal>
                    <Dialog visible={showedDialog} onDismiss={() => setRemoveAction(null)}>
                        <Dialog.Title>Remove Goal</Dialog.Title>
                        <Dialog.Content>
                        <Paragraph>Remove goal by Yarik at 22:40</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                        <Button onPress={() => setRemoveAction(null)}>Cancel</Button>
                        <Button onPress={() => {
                            onDelete(removeAction)
                            setRemoveAction(null)
                        }}>Confirm</Button>
                        </Dialog.Actions>
                    </Dialog>
                    </Portal>
                 </View>
   
                <ScreenWrapper withScrollView={true}>
                <List.Section>
                    <List.Subheader>Activity</List.Subheader>
                        {activities.map(({type, player, id, timestamp }, index) => {
                            const isGoalType = ['ARGOAL', 'AMGOAL', 'RGOAL', 'MGOAL'].includes(type);
                            let title = GameActionTypes[type].title




                            if (isGoalType) {
                                title = `${player.name} scored ${title}`
                                if (canMakeAction) {
                                     return (
                                        <List.Item key={`${id}-${index}`} id={id}
                                            style={{ borderBottomWidth: 0.5, borderBottomColor: '#777'}}
                                            title={`${player.name} scored ${title}`}
                                            description={timestamp}
                                            onPress={() => {
                                                setRemoveAction(id)
                                            }}
                                            left={() => <List.Icon color={theme.colors.text} icon={GameActionTypes[type].icon} />}
                                            right={() => <List.Icon color={'#c2524a'} icon="close"  />}
                                        />
                                    )
                                }
                               
                            }

                            if (type === 'SWAP') {
                                title = `${player.team} ${title}`
                            }

                            return (
                                <List.Item key={`${id}-${index}`} id={id}
                                style={{ borderBottomWidth: 0.5, borderBottomColor: '#777'}}
                                    title={title}
                                    description={timestamp}
                                    left={() => <List.Icon color={theme.colors.text} icon={GameActionTypes[type].icon} />}
                                />
                            )
                        })}
                        
                    </List.Section>
            </ScreenWrapper>
        </>
    )
}

export { GameActivitiesList };