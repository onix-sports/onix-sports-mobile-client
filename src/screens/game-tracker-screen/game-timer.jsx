import { Title } from 'react-native-paper';
import {  View  } from 'react-native';
import * as React from 'react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function GameTimer({ startedAt, paused }) {
    const [gameTime, setGameTime] = React.useState(null);

    React.useEffect(() => {
        if (!startedAt) return;

        let secTimer = setInterval( () => {
            setGameTime(dayjs.duration(dayjs().diff(startedAt)).format('mm:ss'))
        },1000)

        return () => clearInterval(secTimer);
    }, [startedAt]);

    if (!gameTime) {
        return <></>
    }

    return (
        <View style={{ position: 'absolute', top: 5, padding: 5, fontSize: 24, right: 10, flexDirection: 'row' }}>
            <Title>{gameTime}</Title>
        </View>
    )
}

export { GameTimer }