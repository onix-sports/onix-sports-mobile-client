import * as React from 'react';
import { Chip, Avatar, IconButton } from 'react-native-paper';

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


function Player({ selected, onPress, player, autogolPlayer, onAutogol }) {
    const { team, position, name, amGoals, arGoals, mGoals, rGoals, _id, avatarUrl } = player;
    const isSelected = _id === selected;
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

                onPress(_id);
            }}
            selected={isSelected}
            >
                {shortName} |{mGoals + rGoals}|
        </Chip>
    )
}

function SwapEl({ onPress, top, red }) {
    const xStyle = red ? { left: 80 } : { right: 80 };

    return <IconButton
                icon={'account-convert'}
                color={'#fff'}
                style={{ position: 'absolute', top, zIndex: 100, ...xStyle }}
                size={30}
                onPress={onPress}
            />
}

function Players({ players, canMakeAction, onSwap, selected, setSelected, autogolPlayer, onAutogol }) {
    if (players.length !== 4) {
        return <></>
    }

    return (
        <>
            {canMakeAction && (
                <>
                    <SwapEl top={145} red onPress={() => onSwap(players[0]._id)} />
                    <SwapEl top={145} left={80} onPress={() => onSwap(players[2]._id)} />
                </>
            )}
            <Player player={players[0]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
            <Player player={players[1]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
            <Player player={players[2]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
            <Player player={players[3]} selected={selected} onPress={setSelected} autogolPlayer={autogolPlayer} onAutogol={onAutogol} />
        </>
    )
}

export { Players };