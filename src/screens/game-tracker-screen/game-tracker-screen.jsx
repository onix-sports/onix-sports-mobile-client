import * as React from 'react';
import { Chip, Avatar, Title, Button, IconButton, Card, Text } from 'react-native-paper';
import {  View, Image, StyleSheet,  } from 'react-native';
import GameFieldImg from './game-field-bg.svg';
import { ScreenWrapper, ScreenWithLoader, ScreenActivityIndicator } from '../../components';
import SvgUri from 'react-native-svg-uri';
import { useGameTracker } from '../../hooks';
import { numberHelpers } from '../../utils/number-helpers';


const ChipPlayersOpt = {
    red: {
        goalkeeper: {
             bottom: 90, left: 3, backgroundColor: '#c2524a80'
        },
        forward: {
            top: 90, right: 180, backgroundColor: '#c2524a80'
        }
    },
    blue: {
        goalkeeper: {
            top: 90, right: 3,  backgroundColor: '#4099e080'
        },
        forward: {
            bottom: 90, left: 180,  backgroundColor: '#4099e080'
        }
    }
}


function PlayerChip({ selected, onPress, goals, player, autogolPlayer, onAutogol }) {
    const { team, position, name, amGoals, arGoals, mGoals, rGoals, _id, avatarUrl } = player;
    const isSelected = _id === selected?._id;
    const shortName = name.length < 7 ? name : `${name.substring(0, 7)}...`;

    const isSetAutogol = autogolPlayer && autogolPlayer?.team !== team;

    return (
        <Chip 
            id={_id}
            style={{ position: 'absolute', zIndex: 100, ...ChipPlayersOpt[team][position] }} 
            avatar={<Avatar.Image size={24} source={{ uri: avatarUrl || 'https://www.w3schools.com/howto/img_avatar.png' }} />}
            textStyle={{ color: isSetAutogol ? '#ffeb3b' : (isSelected ? '#000' : '#fff') }}
            onPress={() => {
                if (isSetAutogol) {
                    onAutogol(_id, autogolPlayer._id)

                    return onPress(null);
                }

                if (isSelected) return onPress(null)

                onPress(player);
            }}
            selected={isSelected}
            >
                {shortName} |{mGoals + rGoals}|
        </Chip>
    )
}

function GoalsT({ color, text }) {
    return (<Title style={{ fontSize: 24, color, padding: 5, fontWeight: 800 }}>{text}</Title>)
}

function SwapEl({ onPress, top, red }) {
    const xStyle = red ? { left: 80 } : { right: 80 }
    return <IconButton
                icon={'account-convert'}
                color={'#fff'}
                style={{ position: 'absolute', top, zIndex: 100, ...xStyle }}
                size={30}
                onPress={onPress}
            />
}

function GameTrackerScreen({ navigation, route }) {
    const { initGameController, games, isLoading, GameStatus } = useGameTracker();

    const [gameController, setGameController] = React.useState(null);

    const [selectedPlayer, setSelectedPlayer] = React.useState(null);

    const [autogolPlayer, setAutogolPlayer] = React.useState(null);

    const [status, setStatus] = React.useState(null);

    const [score, setScore] = React.useState({ blue: 0, red: 0});
    const [players, setPlayers] = React.useState([]);

    const [paused, setPaused] = React.useState(true);
    const [disabledStartBtn, setDisabledStartBtn] = React.useState(true);

    React.useEffect(() => {
        setDisabledStartBtn(false);

    }, [gameController]);

    React.useEffect(() => {
        const game = games[route.params?.id];
        if (!game) return;

        setStatus(game.status)
        setScore(game.score);
        setPlayers(game.players);
        setPaused(game.status === GameStatus.PAUSED);
        setDisabledStartBtn(game.status === GameStatus.FINISHED);
        
        if (selectedPlayer) {
            setSelectedPlayer(game.players.find(player => player._id === selectedPlayer._id))
        }
    }, [games]);

    if (!gameController) {
        setPaused(true);
        setDisabledStartBtn(true);
        setGameController(initGameController(route.params?.id))
    }

    const onAutogol = (playerId, enemyId) => {
        gameController.goal(playerId, enemyId);
        setAutogolPlayer(null);
    }

    const isFinished = status === GameStatus.FINISHED;
  
    return (
        <ScreenWithLoader isLoading={isLoading}>
            <ScreenWrapper withScrollView={true}>
                <View style={{ alignItems: 'center', position: 'relative' }}>
                <View style={{ position: 'absolute', zIndex: paused ? 120 : -1, backgroundColor: paused ? '#00000090' : null, width: '100%', height: 350 }}></View>
                    <View style={{ position: 'absolute', top: 10, flexDirection: 'row' }}>
                        <GoalsT text={score.red} color={'#c2524a'} />
                        <GoalsT text={'X'} color={'#fff'} />
                        <GoalsT text={score.blue} color={'#4099e0'} />
                    </View>
                    {!disabledStartBtn && (
                        <IconButton
                            icon={paused ? 'play-circle' : "pause-circle"}
                            color={'#fff'}
                            style={{ position: 'absolute', top: 132, zIndex: 140 }}
                            size={50}
                            onPress={() => {
                                // setPaused(!paused)
                                gameController.pause()
                                setSelectedPlayer(null);
                            }}
                        />
                    )}
                    {isFinished && (
                        <Title style={{ position: 'absolute', top: 160, zIndex: 140, backgroundColor: '#00000090', paddingLeft: 10, paddingRight: 10 }}>
                            GAME FINISHED
                        </Title>
                    )}
                    {players.length === 4 && (
                        <>
                            {!isFinished && (
                                <>
                                    <SwapEl top={145} red onPress={() => gameController.swap(players[0]._id)} />
                                    <SwapEl top={145} left={80} onPress={() => gameController.swap(players[2]._id)} />
                                </>
                            )}
                            <PlayerChip player={players[0]} selected={selectedPlayer} onPress={setSelectedPlayer} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
                            <PlayerChip player={players[1]} selected={selectedPlayer} onPress={setSelectedPlayer} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
                            <PlayerChip player={players[2]} selected={selectedPlayer} onPress={setSelectedPlayer} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
                            <PlayerChip player={players[3]} selected={selectedPlayer} onPress={setSelectedPlayer} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
                        </>
                    )}
                    
                    <GameFieldImg
                        width={'100%'}
                        height={350}
                    />
                    {selectedPlayer && (
                    <View style={{ position: 'absolute', bottom: !isFinished ? -20 : 5, alignItems: 'center', width: '100%' }}>
                        <Title>{autogolPlayer ? 'Select enemy you will give a goal' : `${selectedPlayer.name}, goals: | G: ${selectedPlayer.rGoals} | F: ${selectedPlayer.mGoals} |`}</Title>
                        {!isFinished && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button style={{ flex: 1 }} icon="soccer" onPress={() => {
                                    gameController.goal(selectedPlayer._id);
                                }}>
                                    Goal
                                </Button>
                                <Button style={{ flex: 1 }} icon="alert-octagram"  onPress={() => setAutogolPlayer(selectedPlayer)}>
                                    Autogoal
                                </Button>
                            </View>
                        )}
                        
                        
                    </View>
                    )}
                    
                </View>
               
            </ScreenWrapper>
        </ScreenWithLoader>
    );
}

export { GameTrackerScreen };