import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper,  ScreenActivityIndicator } from '../../components';
import { useActiveTournaments } from '../../hooks';

import { FAB, Card, Title } from 'react-native-paper';
import {View, StyleSheet } from 'react-native'

const getImgUrl = (id) => {
    const num = parseInt(id, 10) || Math.ceil(Math.random() * 100)
    if(Number.isNaN(num) || num < 20) {
        return getImgUrl()
    }
    
    return `https://media.api-sports.io/football/teams/${num}.png`
}

const parseTitleShort = (title, index) => {
    let id;

    if (title.includes('Tournament #')) {
        try {
            id = title.split('Tournament #')[1];
            return {
                id,
                title: `t-m #${id}`
            };
        } catch (error) {
            return {
                title: `Anonym ${index}`.
                id
            }
        }
        
    }

    if (title === 'Tournament') {
        return {
                title: `Anonym ${index}`,
                id
            }
    }

    return {
            title: title || `Anonym ${index}`,
            id
            }
}

const ActiveTournaments = () => {
    const navigation = useNavigation();

    const {
        isLoading, 
        isRefreshing,
        onRefresh,
        activeTournaments
    } = useActiveTournaments();

    if (isLoading) {
        return <ScreenActivityIndicator />
    }

    return (
        <View style={{height: '100%', position: 'relative'}}>
            <ScreenWrapper withScrollView={true} isRefreshing={isRefreshing} onRefresh={onRefresh}>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                {
                activeTournaments.map((tournament, index) => {
                    const { _id, title } = tournament;
                    const shortTitle = parseTitleShort(title, index);

                    return <Card style={{
                        height: 180,
                        width: 180,
                        borderColor: '#fff',
                        borderWidth: 0.5,
                        margin: 5,           
                    }} key={_id} onPress={() => {
                        navigation
                            .navigate('ActiveTmGames', {
                                    id: _id,
                            })
                    }}
                    >
                    
                    <Card.Cover 
                        source={{ uri: getImgUrl(shortTitle.id) }} 
                        style={{ width: '75%', height: '70%', marginLeft: '12.5%', marginTop: 17 }}
                    />
                    <Card.Content>
                        <Title style={{fontSize: 14, textAlign: 'center'}}>{shortTitle.title}</Title>
                    </Card.Content>
                    </Card>
                }) 
                }
            </View>
            </ScreenWrapper>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('GenerationTournament')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export { ActiveTournaments }