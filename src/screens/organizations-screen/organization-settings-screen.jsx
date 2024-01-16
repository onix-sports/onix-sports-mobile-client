import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useOrganization } from '../../hooks/use-organization';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from "react-qr-code";
import * as ExpoLinking from 'expo-linking';

function OrganizationSettingsScreen() {
    const [title, setTitle] = useState('');
    const [qrCode, setQrCode] = useState('');
    const { 
        updateOrganization, 
        organization, 
        generateInviteToken,
        inviteToken
    } = useOrganization();

    const onChangeText = (title) => {
        setTitle(title);

        if (title) {
            updateOrganization({ title });
        }
    };

    const getQrCode = () => ExpoLinking.createURL('join-organization', { queryParams: { token: inviteToken } });

    useState(() => {
        setTitle(organization.title);
        setQrCode(getQrCode());
    }, [organization]);

    useFocusEffect(
        useCallback(() => {
            generateInviteToken();
        }, [])
    );

    return (
        <View>
            <TextInput
                style={styles.input}
                label="Organization title"
                onChangeText={onChangeText}
                value={title}>
            </TextInput>

            <Text
                style={styles.tokenLabel}
                >
                Invite token
            </Text>

            <Text
                style={styles.token}
                >
                {inviteToken}
            </Text>

            <View 
                style={styles.code}>
                <QRCode
                    value={qrCode}>
                </QRCode>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
      margin: 12,
      borderWidth: 1,
    },
    token: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 36,
        marginTop: 12,
    },
    tokenLabel: {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 24,
        marginTop: 24,
    },
    code: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 12,
        backgroundColor: '#fff',
        marginTop: 24
    }
  });
  

export { OrganizationSettingsScreen };
