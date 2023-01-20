import { StyleSheet, Linking } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import React from "react";
import { View, ImageBackground } from 'react-native';

import { api } from '../../libs/base-api';
import { Button, ScreenWrapper, Text } from '../../components';
import { forOs } from '../../utils';
import * as WebBrowser from 'expo-web-browser';

function SignInTelegramScreen() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignInPress = async () => {
    try {
      setIsLoading(true);
      const redirectUrl = ExpoLinking.createURL('sign-in-oauth');

      const uri = `${api.v1.url}/auth/telegram/sign-in?redirect=${redirectUrl}`;
   
      await forOs()
        .ios(() => WebBrowser.openBrowserAsync(uri))
        .android(() => Linking.openURL(uri))
        .val()

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper withScrollView={false} style={styles.container}>
     
        <ImageBackground 
          source={require('../../../assets/login-bg.webp')}
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            

          }}
        >
      <View style={{
        textAlign: 'center',
        backgroundColor: '#000000c0',
        padding: 40,
        width: '100%',
      }}>
        <Text style={styles.logo}>SOCCER CLUB</Text>
        <Button
          mode="contained"
          contentStyle={styles.signInButton}
          onPress={handleSignInPress}
          loading={isLoading}
        >
          Let`s Start
        </Button>
      </View>
      </ImageBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingBottom: -20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    fontFamily: 'AstroSpace',
    fontSize: 32,
    color: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    paddingVertical: 2,
  }
});

export { SignInTelegramScreen };
