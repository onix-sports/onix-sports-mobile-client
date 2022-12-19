import * as React from 'react';
import { StyleSheet, View } from "react-native";
import { ScreenWrapper, ScreenWithLoader } from '../../components';
import { useUsers, useActiveTournaments } from '../../hooks';
import {  Button, List  } from 'react-native-paper';

const GenerationTournamentScreen = () => {
    const {isLoading, users} = useUsers();
    const {
        createTournament, 
    } = useActiveTournaments();

    const [players, setPlayers] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    React.useEffect(() => {
        if (!isLoading) {
            setPlayers([...users])
        }
    }, [isLoading, users]);
   
    return (
        <ScreenWithLoader isLoading={isLoading}>
            <View style={styles.container}>
                
                <List.Section>
                    <ScreenWrapper withScrollView={true} style={styles.players}>
                        <List.Subheader>Players</List.Subheader>
                        {players.map((player) => {
                            const { _id, name, avatarUrl } = player;

                            return (
                                <List.Item key={`players-${_id}`}  title={name} left={() => <List.Icon onError={(e) => {
                                console.log(e)
                            }} style={{ borderRadius: 50 }} icon={{ uri: avatarUrl }} />} onPress={() => {
                                    setPlayers(players.filter(item => item._id !== _id))
                                    setSelected([...selected, player])
                                }}/>
                        )})}
                    </ScreenWrapper>
                </List.Section>
        
                <List.Section>
                    <ScreenWrapper withScrollView={true} style={styles.selected}>
                        <List.Subheader>Selected</List.Subheader>
                        {selected.map((player) => {
                            const {_id, name, avatarUrl} = player;

                            return (
                            <List.Item key={`selected-${_id}`} title={name} left={() => <List.Icon onError={(e) => {
                                console.log(e)
                            }} style={{ borderRadius: 50 }} icon={{ uri: avatarUrl }} />} onPress={() => {
                                setSelected(selected.filter(item => item._id !== _id))
                                setPlayers([...players, player])
                            }}/>
                        )})}
                    </ScreenWrapper>
                </List.Section>
            </View>
            <Button style={styles.submit} disabled={selected.length < 4 && (selected.length < 7 || selected.length === 8)} icon="gamepad" mode="contained" onPress={() => createTournament(selected.map(({_id}) => _id), true)}>
                 Generate
            </Button>
        </ScreenWithLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 12
       
    },
    submit: {
        flex: 0.7,
        marginBottom: 25
    },
    players: {
        borderRightColor: '#fff',
        borderRightWidth: 1,
        minWidth: "50%",
        minHeight: '100%'
    },
    selected: {
        minWidth: "50%",
        minHeight: '100%'
    }

});

export { GenerationTournamentScreen };