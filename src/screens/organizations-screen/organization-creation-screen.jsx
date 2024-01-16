import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useOrganizations } from '../../hooks/use-organizations';

function OrganizationCreationScreen() {
    const [title, setTitle] = useState('');
    const { createOrganization } = useOrganizations();

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder='Organization title'
                onChangeText={setTitle}
                value={title}>
            </TextInput>

            <Button
                onPress={() => createOrganization(title)}
                icon={'plus'}>
                Create
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
  

export { OrganizationCreationScreen };
