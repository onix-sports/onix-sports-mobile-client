import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper,  ScreenActivityIndicator } from '../../components';
import { useActiveTournament } from '../../hooks';

import { GenerationTournament } from './gen-tm-screen';
import { Text, IconButton, Title, Button } from 'react-native-paper';
import {View, TouchableOpacity, StyleSheet } from 'react-native'

export const ActiveTournament = () => {
    const navigation = useNavigation();

    const {isLoading, activeTournament, activeGames, createTournament, closeTournament} = useActiveTournament();

    if (isLoading) {
        return <ScreenActivityIndicator />
    }

    if (!activeTournament) {
        return <GenerationTournament onCreateTournament={createTournament} />
    }

    return (
        <ScreenWrapper withScrollView={true}>
                <View style={{ marginBottom: 10 }}>
                    <View style={styles.container} accessibilityRole="button" accessible>
                        <Title style={styles.indexRow}></Title>
                        <Title style={styles.redTitle}>Red</Title>
                        <Title style={styles.statusTitle}>Status</Title>
                        <Title style={styles.blueTitle}>Blue</Title>
                        <Title style={styles.indexRow}></Title>
                    </View>
                    {activeGames.map((game, index) => {
                        const { _id, players, status } = game;

                        return (
                            <TouchableOpacity key={_id} onPress={() => {
                                navigation.navigate('GameTracker', {
                                    id: _id,
                                    status
                                })
                            }}>
                            <View style={styles.gameWrap} accessibilityRole="button" accessible>
                                <Text style={styles.indexRow}>{index + 1}.</Text>
                                <View style={styles.redRow}>
                                    <Text style={styles.redText} id={players[0]._id}>{players[0].name}</Text>
                                    <Text style={styles.redText} id={players[1]._id}>{players[1].name}</Text>
                                </View>
                                <Text style={styles.statusRow}>{status}</Text>
                                <View style={styles.blueRow}>
                                    <Text style={styles.blueText} id={players[2]._id}>{players[2].name}</Text>
                                    <Text style={styles.blueText} id={players[3]._id}>{players[3].name}</Text>
                                </View>
                                <View style={styles.indexRow}>
                                    <IconButton size={26} icon="gesture-tap-hold" iconColor={'#777'} />
                                </View>
                            </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Button style={styles.close} icon="gamepad" mode="contained" onPress={closeTournament}>
                    Close Tournament
                </Button>
        </ScreenWrapper>
    );
}

const viewFontSize = 17;
const rowPadding = 5;
const textAlign = 'center';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20
  },
  close: {
  },
  gameWrap: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#777',
    borderTopWidth: 0.3,
    alignItems: 'center'
  },
  indexRow: { fontSize: viewFontSize, flex: 1 },
  redTitle: { flex: 3, textAlign, color: '#c2524a', fontSize: viewFontSize },
  blueTitle: { flex: 3, textAlign, color: '#4099e0', fontSize: viewFontSize  },
  statusTitle: { flex: 2, textAlign, fontSize: viewFontSize  },
  redText: { textAlign, color: '#c2524a', fontSize: viewFontSize, padding: rowPadding },
  blueText: { textAlign, color: '#4099e0', fontSize: viewFontSize, padding: rowPadding },
  redRow: { flex: 3, },
  statusRow: { flex: 2, textAlign, fontSize: viewFontSize, padding: rowPadding },
  blueRow: { flex: 3 }
});