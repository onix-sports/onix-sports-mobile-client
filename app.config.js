module.exports = ({ config }) => {

  return {
    ...config,
    extra: {
      version: process.env.MY_CUSTOM_PROJECT_VERSION || '0.0.1',
      eas: {
        projectId: "54fef873-cb24-4f56-9782-ffc07d5d31fd"
      },
      android: {
        package: "com.ya_myn.onixsf"
      },
      projectId: "54fef873-cb24-4f56-9782-ffc07d5d31fd",
      baseApiUrl: process.env.API_URL || 'https://onix-sports-beta.herokuapp.com',
      wsUrl: process.env.WS_API || 'wss://onix-sports-beta.herokuapp.com',
      thingSpeakApiUrl: process.env.THINGSPEAK_API_URL,
    },
  };
};
