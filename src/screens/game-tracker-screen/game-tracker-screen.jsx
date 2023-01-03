import * as React from 'react';
import { Title, Button, IconButton, Divider, List, useTheme, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import {  View  } from 'react-native';
import GameFieldImg from './game-field-bg.svg';
import { ScreenWrapper, ScreenWithLoader } from '../../components';
import { useGameTracker, useAuth } from '../../hooks';
import { Players } from './game-players';
import { GameActivitiesList } from './game-activities-list';
import { GameTimer } from './game-timer';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const screenTypes = {
    portrait: 'portrait',
    landScape: 'landscape'
}

const fullScreenOpt = {
    [screenTypes.portrait]: {
        root: {
            style: { alignItems: 'center', position: 'relative', marginBottom: 25 }
        },
        fsBtn: {
            icon: 'fullscreen',
            actionType: screenTypes.landScape,
            size: 30,
            style: { position: 'absolute', top: -7, right: -7 }
        },
        gameField: {
            width: '100%',
            height: 350,
            style: {}
        },
        pauseBtn: {
            style: { position: 'absolute', top: 132, zIndex: 140 },
            size: 50
        },
        pauseBg: {
            height: 380,
            width: '100%'
        },
        goals: {
            style: { position: 'absolute', top: -1, flexDirection: 'row' }
        },
        selectedActions: {
            style: {  }
        }
    },
    [screenTypes.landScape]: {
        root: {
            style: { transform: [{ rotate: '90deg'}], alignItems: 'center', position: 'relative', marginBottom: 25 }
        },
        fsBtn: {
            icon: 'fullscreen-exit',
            actionType: screenTypes.portrait,
            size: 34,
            style: { 
                backgroundColor: '#00000070', 
                borderRadius: 10, 
                position: 'absolute', 
                top: '23.3%', 
                zIndex: 90, 
                right:  '-26.5%',
            }
        },
        gameField: {
            width: '165%',
            height: '100%',
            style: {  marginTop: 0 }
        },
        pauseBtn: {
            style: { 
                position: 'absolute', 
                top: '50%',
                zIndex: 140,
                transform: [{ translateY: -65 }]
            },
            size: 80
        },
        pauseBg: {
            height: '100%',
            width: '500%'
        },
        goals: {
            style: { 
                position: 'absolute', 
                top: '24%',
                flexDirection: 'row', 
                right: '50%',
                transform: [{ translateX: 47 }], 
                zIndex: 90,
                backgroundColor: '#00000070',
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 10,
             }
        },
        selectedActions: {
            style: { 
                zIndex: 90,
                bottom: '24%',
                left: '-25%',
                backgroundColor: '#00000070',
                width: '150%',
                flexDirection: 'column', 
                justifyContent: 'space-between'
             }
        }
        
    },
}

function GoalsT({ color, text }) {
    return (<Title style={{ fontSize: 24, color, padding: 5, fontWeight: "800" }}>{text}</Title>)
}


function GameTrackerScreen({ route }) {
    const theme = useTheme();

    const { initGameController, GameStatus } = useGameTracker();
    const { session } = useAuth();

    const [gameController, setGameController] = React.useState(null);

    const [screenMode, setScreenMode] = React.useState(screenTypes.portrait);

    const [selectedPlayerId, setSelectedPlayer] = React.useState(null);

    const [autogolPlayer, setAutogolPlayer] = React.useState(null);

    const [activities, setActivities] = React.useState([]);

    const [status, setStatus] = React.useState(null);
    const [startedAt, setStartedAt] = React.useState(null);
    const [score, setScore] = React.useState({ blue: 0, red: 0});
    const [players, setPlayers] = React.useState([]);

    const [paused, setPaused] = React.useState(true);
    const [disabledStartBtn, setDisabledStartBtn] = React.useState(true);

    React.useEffect(() => {
        gameController.onUpdate((game) => {
            setStatus(game.status)
            setStartedAt(game.startedAt)
            setActivities(game.actions
                .sort((prev, next) => next.timeFromStart - prev.timeFromStart)
                .map(activity => {
                    return {
                        ...activity,
                        timestamp: dayjs.duration(activity.timeFromStart).format('mm:ss')
                    }
                })
            );
            setScore(game.score);
            setPlayers(game.players);
            setPaused(game.status === GameStatus.PAUSED || game.status === GameStatus.DRAFT);
            setDisabledStartBtn(game.status === GameStatus.FINISHED);
        })

    }, [gameController]);

    if (!gameController) {
        setPaused(true);
        setDisabledStartBtn(true);
        setGameController(initGameController(route.params?.id, route.params?.status))
    }

    const onAutogol = (playerId, enemyId) => {
        gameController.goal(playerId, enemyId);
        setAutogolPlayer(null);
    }

    const isFinished = status === GameStatus.FINISHED;
    
    const canMakeAction = session.role === 'admin' && !isFinished;

    const selectedPlayer = players.find(player => player._id === selectedPlayerId)
  
    return (
        <ScreenWithLoader isLoading={false}>
                <View style={fullScreenOpt[screenMode].root.style}>
                <View style={{ position: 'absolute', zIndex: paused ? 120 : -1, backgroundColor: paused ? '#00000090' : null, width: fullScreenOpt[screenMode].pauseBg.width, height: fullScreenOpt[screenMode].pauseBg.height }}></View>
                    <View style={fullScreenOpt[screenMode].goals.style}>
                        <GoalsT text={score.red} color={'#c2524a'} />
                        <GoalsT text={'X'} color={'#fff'} />
                        <GoalsT text={score.blue} color={'#4099e0'} />
                    </View>
                    <GameTimer startedAt={startedAt} activities={activities} screenMode={screenMode} />
                    <IconButton
                            icon={fullScreenOpt[screenMode].fsBtn.icon}
                            color={'#fff'}
                            style={fullScreenOpt[screenMode].fsBtn.style}
                            size={fullScreenOpt[screenMode].fsBtn.size}
                            onPress={() => {
                                setScreenMode(fullScreenOpt[screenMode].fsBtn.actionType)
                            }}
                    />
                  
                    {session.role === 'admin' 
                        ? (<>
                            {!disabledStartBtn && (
                                <IconButton
                                    icon={paused ? 'play-circle' : "pause-circle"}
                                    color={'#fff'}
                                    style={fullScreenOpt[screenMode].pauseBtn.style}
                                    size={fullScreenOpt[screenMode].pauseBtn.size}
                                    onPress={() => {
                                        setPaused(!paused);
                                        gameController.pause();
                                    }}
                                />
                            )}
                        </>) 
                        : (<>
                            {paused && (
                                <Title style={{ position: 'absolute', top: 160, zIndex: 140, backgroundColor: '#00000090', paddingLeft: 10, paddingRight: 10 }}>
                                    GAME PAUSED
                                </Title>
                            )}
                        </>)}
                    {isFinished && (
                        <Title style={{ position: 'absolute', top: 160, zIndex: 140, backgroundColor: '#00000090', paddingLeft: 10, paddingRight: 10 }}>
                            GAME FINISHED
                        </Title>
                    )}
                    <Players 
                        players={players} 
                        canMakeAction={canMakeAction}
                        onSwap={gameController?.swap} 
                        selected={selectedPlayerId} 
                        setSelected={setSelectedPlayer} 
                        autogolPlayer={autogolPlayer} 
                        onAutogol={onAutogol} 
                        screenMode={screenMode}
                    />
                    <GameFieldImg
                        width={fullScreenOpt[screenMode].gameField.width}
                        height={fullScreenOpt[screenMode].gameField.height}
                        style={fullScreenOpt[screenMode].gameField.style}
                    />
                    {selectedPlayerId && !paused && (
                    <View style={{ position: 'absolute', bottom: canMakeAction ? -20 : 5, alignItems: 'center', width: '100%', ...fullScreenOpt[screenMode].selectedActions.style }}>
                        <Title>{autogolPlayer ? 'Select enemy you will give a goal' : `${selectedPlayer.name}, goals: | G: ${selectedPlayer.rGoals} | F: ${selectedPlayer.mGoals} |`}</Title>
                        {canMakeAction && (
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
                <Divider />
                <GameActivitiesList activities={activities} onDelete={gameController?.cancel} canMakeAction={canMakeAction} />        
        </ScreenWithLoader>
    );
}

export { GameTrackerScreen };