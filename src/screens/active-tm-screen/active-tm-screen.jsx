import * as React from 'react';
import { ScreenWrapper, ScreenWithLoader } from '../../components';
import { useActiveTournament } from '../../hooks';

import { GenerationTournament } from './gen-tm-screen';
import { Text } from 'react-native-paper';

export const ActiveTournament = () => {
    const {isLoading, opened, closed} = useActiveTournament();

    if (!opened) {
        return <GenerationTournament />
    }

    return (
        <ScreenWithLoader isLoading={isLoading}>
            <ScreenWrapper withScrollView={true}>
                <Text>In Development test ...</Text>
            </ScreenWrapper>
        </ScreenWithLoader>
    );
}