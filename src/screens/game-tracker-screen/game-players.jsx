import * as React from 'react';
import { Chip, Avatar, IconButton } from 'react-native-paper';

const screenTypes = {
    portrait: 'portrait',
    landScape: 'landscape'
}

const fullScreenOpt = {
    [screenTypes.portrait]: {
        swap: {
            style: {
                red: { left: 80, top: 145 },
                blue: { right: 80, top: 145 }
            },
            size: 30
        },
        player: {
            size: 24
        }
    },
    [screenTypes.landScape]: {
        swap: { 
            style: {
                red: { left: '12%', top: '49%', transform: [{ translateY: -30}] },
                blue: { right: '12%', top: '49%', transform: [{ translateY: -30}] }
            },
            size: 40
        },
        player: {
            size: 32
        }
    },
}

const ChipPlayersOpt = {
    red: {
        goalkeeper: {
            [screenTypes.portrait]: { bottom: 90, left: 3, backgroundColor: '#c2524a80' },
            [screenTypes.landScape]: { bottom: '35%', transform: [{ scale: 1.2 }], left: '-10%', backgroundColor: '#c2524a80' }
        },
        forward: {
            [screenTypes.portrait]: { top: 90, right: 180, backgroundColor: '#c2524a80' },
            [screenTypes.landScape]: { top: '35%', left: '32%', transform: [{ scale: 1.2 }], backgroundColor: '#c2524a80' },
        }
    },
    blue: {
        goalkeeper: {
            [screenTypes.portrait]: { top: 90, right: 3,  backgroundColor: '#4099e080' },
            [screenTypes.landScape]: { top: '35%', right: '-10%', transform: [{ scale: 1.2 }],   backgroundColor: '#4099e080' }
        },
        forward: {
            [screenTypes.portrait]: { bottom: 90, left: 180,  backgroundColor: '#4099e080' },
            [screenTypes.landScape]: { bottom: '35%', right: '32%', transform: [{ scale: 1.2 }], backgroundColor: '#4099e080' }
        }
    }
}


function Player({ selected, onPress, player, autogolPlayer, onAutogol, screenMode }) {
    const { team, position, name, amGoals, arGoals, mGoals, rGoals, _id, avatarUrl } = player;
    const isSelected = _id === selected;
    const shortName = name.length < 7 ? name : `${name.substring(0, 7)}...`;

    const isSetAutogol = autogolPlayer && autogolPlayer?.team !== team;

    return (
        <Chip 
            id={_id}
            style={{ position: 'absolute', zIndex: 100, ...ChipPlayersOpt[team][position][screenMode] }} 
            avatar={<Avatar.Image size={24} source={{ uri: avatarUrl || 'https://www.w3schools.com/howto/img_avatar.png' }} />}
            textStyle={{ color: isSetAutogol ? '#ffeb3b' : (isSelected ? '#000' : '#fff') }}
            onPress={() => {
                if (isSetAutogol) {
                    onAutogol(_id, autogolPlayer._id)

                    return onPress(null);
                }

                if (isSelected) return onPress(null)

                onPress(_id);
            }}
            selected={isSelected}
            >
                {shortName} |{mGoals + rGoals}|
        </Chip>
    )
}

function SwapEl({ onPress, red, screenMode }) {
    const xStyle = red ? fullScreenOpt[screenMode].swap.style.red : fullScreenOpt[screenMode].swap.style.blue;

    return <IconButton
                icon={'account-convert'}
                color={'#fff'}
                style={{ position: 'absolute', zIndex: 100, ...xStyle }}
                size={fullScreenOpt[screenMode].swap.size}
                onPress={onPress}
            />
}

function Players({ players, canMakeAction, onSwap, selected, setSelected, autogolPlayer, onAutogol, screenMode }) {
    if (players.length !== 4) {
        return <></>
    }

    return (
        <>
            {canMakeAction && (
                <>
                    <SwapEl red onPress={() => onSwap(players[0]._id)} screenMode={screenMode} />
                    <SwapEl onPress={() => onSwap(players[2]._id)} screenMode={screenMode} />
                </>
            )}
            <Player player={players[0]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} screenMode={screenMode} />
            <Player player={players[1]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} screenMode={screenMode} />
            <Player player={players[2]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} screenMode={screenMode} />
            <Player player={players[3]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} screenMode={screenMode} />
        </>
    )
}

export { Players };