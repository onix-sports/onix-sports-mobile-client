module.exports = ({ config }) => {
  console.log('process.env.API_URL :>> ', process.env.API_URL);
  return {
    ...config,
    extra: {
      version: process.env.MY_CUSTOM_PROJECT_VERSION || '0.0.1',
      eas: {
        projectId: "54fef873-cb24-4f56-9782-ffc07d5d31fd",
      },
      android: {
        package: "com.ya_myn.onixsf"
      },
      projectId: "54fef873-cb24-4f56-9782-ffc07d5d31fd",
      // baseApiUrl: process.env.API_URL || 'https://onix-sports-old.herokuapp.com',
      // wsUrl: process.env.WS_API || 'wss://onix-sports-old.herokuapp.com',
      // baseApiUrl: 'http://localhost:3003',
      // wsUrl: 'ws://localhost:3003',
      baseApiUrl: 'https://onix-sports-beta.herokuapp.com',
      wsUrl: 'wss://onix-sports-beta.herokuapp.com',
      // baseApiUrl: 'https://186f-195-62-14-236.ngrok.io',
      // wsUrl: 'wss://186f-195-62-14-236.ngrok.io',

      thingSpeakApiUrl: process.env.THINGSPEAK_API_URL,
    },
  };
};
