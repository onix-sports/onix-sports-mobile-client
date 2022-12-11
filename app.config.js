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
      baseApiUrl: process.env.API_URL || 'http://localhost:3010',
      wsUrl: process.env.WS_API || 'ws://localhost:3010/',
      thingSpeakApiUrl: process.env.THINGSPEAK_API_URL,
    },
  };
};
