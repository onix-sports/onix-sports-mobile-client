import { Title } from 'react-native-paper';
import {  View  } from 'react-native';
import * as React from 'react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const parseGameTime = (startedAt) => {
    return dayjs.duration(dayjs().diff(startedAt)).format('mm:ss');
}

const screenTypes = {
    portrait: 'portrait',
    landScape: 'landscape'
}

const fullScreenOpt = {
    [screenTypes.portrait]: {
        style: { position: 'absolute', top: -1, padding: 5, fontSize: 24, left: 10, flexDirection: 'row', zIndex: 100 }
    },
    [screenTypes.landScape]: {
        style: { 
            position: 'absolute', 
            top: '24%', 
            padding: 5, 
            fontSize: 24, 
            left: '-25%',
            flexDirection: 'row', 
            zIndex: 100,
            backgroundColor: '#00000070',
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
        }
    },
}

function GameTimer({ startedAt, activities, screenMode }) {
    const [gameTime, setGameTime] = React.useState(null);

    React.useEffect(() => {
        if (!startedAt) return;
        
        let timeParser = parseGameTime;

        if (activities[0]?.type === 'PAUSE') {
            timeParser = (startedAt, activities) => {
                return parseGameTime(activities[0].time)
            }
        } else {
            timeParser = (startedAt, activities) => {
                let duration = dayjs.duration(dayjs().diff(startedAt));

                activities.forEach((activity, index) => {
                    if (activity.type === 'RESUME') {
                        const pauseDuration = dayjs.duration(dayjs(activity.time).diff(activities[index + 1].time));
                        
                        duration = duration.subtract(pauseDuration);
                    }
                });

                return duration.format('mm:ss');
            }
        }

        let secTimer = setInterval(() => {
            setGameTime(timeParser(startedAt, activities));
        },1000);

        

        return () => clearInterval(secTimer);
    }, [startedAt, activities]);

    if (!gameTime) {
        return <></>
    }

    return (
        <View style={fullScreenOpt[screenMode].style}>
            <Title>{gameTime}</Title>
        </View>
    )
}

export { GameTimer }