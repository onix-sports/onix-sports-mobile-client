import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useOrganizations } from '../../hooks/use-organizations';

function OrganizationJoinScreen() {
    const [token, setToken] = useState('');
    const { joinOrganization } = useOrganizations();

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder='Organization token'
                onChangeText={setToken}
                value={token}>
            </TextInput>

            <Button
                onPress={() => joinOrganization(token)}
                icon={'plus'}>
                Join
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
  

export { OrganizationJoinScreen };
