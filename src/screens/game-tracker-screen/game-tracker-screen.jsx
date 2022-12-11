import * as React from 'react';
import { Title, Button, IconButton } from 'react-native-paper';
import {  View  } from 'react-native';
import GameFieldImg from './game-field-bg.svg';
import { ScreenWrapper, ScreenWithLoader } from '../../components';
import { useGameTracker, useAuth } from '../../hooks';
import { Players } from './game-players';


function GoalsT({ color, text }) {
    return (<Title style={{ fontSize: 24, color, padding: 5, fontWeight: "800" }}>{text}</Title>)
}



function GameTrackerScreen({ route }) {
    const { initGameController, GameStatus } = useGameTracker();
    const { session } = useAuth();

    const [gameController, setGameController] = React.useState(null);

    const [selectedPlayerId, setSelectedPlayer] = React.useState(null);

    const [autogolPlayer, setAutogolPlayer] = React.useState(null);

    const [status, setStatus] = React.useState(null);

    const [score, setScore] = React.useState({ blue: 0, red: 0});
    const [players, setPlayers] = React.useState([]);

    const [paused, setPaused] = React.useState(true);
    const [disabledStartBtn, setDisabledStartBtn] = React.useState(true);

    React.useEffect(() => {
        gameController.onUpdate((game) => {
            setStatus(game.status)
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
            <ScreenWrapper withScrollView={true}>
                <View style={{ alignItems: 'center', position: 'relative' }}>
                <View style={{ position: 'absolute', zIndex: paused ? 120 : -1, backgroundColor: paused ? '#00000090' : null, width: '100%', height: 350 }}></View>
                    <View style={{ position: 'absolute', top: 10, flexDirection: 'row' }}>
                        <GoalsT text={score.red} color={'#c2524a'} />
                        <GoalsT text={'X'} color={'#fff'} />
                        <GoalsT text={score.blue} color={'#4099e0'} />
                    </View>
                    {session.role === 'admin' 
                        ? (<>
                            {!disabledStartBtn && (
                                <IconButton
                                    icon={paused ? 'play-circle' : "pause-circle"}
                                    color={'#fff'}
                                    style={{ position: 'absolute', top: 132, zIndex: 140 }}
                                    size={50}
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
                    />
                    <GameFieldImg
                        width={'100%'}
                        height={350}
                    />
                    {selectedPlayerId && !paused && (
                    <View style={{ position: 'absolute', bottom: canMakeAction ? -20 : 5, alignItems: 'center', width: '100%' }}>
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
               
            </ScreenWrapper>
        </ScreenWithLoader>
    );
}

export { GameTrackerScreen };