import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { ScreenWrapper, ScreenWithLoader } from '../../components';
import { useLeaderboard } from '../../hooks';
import { numberHelpers } from '../../utils/number-helpers';

const Headers = [
    { title: 'Player', numeric: false },
    { title: 'Games', numeric: true },
    { title: 'GPG', numeric: true },
    { title: 'Winrate', numeric: true },
    { title: 'Score', numeric: true },
];

export const Leaderboard = () => {
    const {
        isLoading, 
        leaderboard, 
        onRefresh,
        isRefreshing
    } = useLeaderboard();

    return (
        <ScreenWithLoader isLoading={isLoading}>
            <ScreenWrapper withScrollView={true} onRefresh={onRefresh} isRefreshing={isRefreshing}>
                <DataTable>
                <DataTable.Header>
                    {Headers.map(({ title, numeric }, index) => (
                        <DataTable.Title key={index} numeric={numeric}>{title}</DataTable.Title>
                    ))}
                </DataTable.Header>
                {leaderboard.map(({ _id, name, gpg, games, winrate, score }) => (
                    <DataTable.Row key={_id}>
                        <DataTable.Cell>{name}</DataTable.Cell>
                        <DataTable.Cell numeric>{games}</DataTable.Cell>
                        <DataTable.Cell numeric>{numberHelpers.round(gpg, 2)}</DataTable.Cell>
                        <DataTable.Cell numeric>{numberHelpers.round(winrate, 2)}%</DataTable.Cell>
                        <DataTable.Cell numeric>{numberHelpers.round(score, 2)}</DataTable.Cell>
                    </DataTable.Row>
                ))}

                
                </DataTable>
            </ScreenWrapper>
        </ScreenWithLoader>
    );
}