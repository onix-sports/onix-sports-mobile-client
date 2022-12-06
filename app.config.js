module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      baseApiUrl: process.env.API_URL || 'http://localhost:3010',
      thingSpeakApiUrl: process.env.THINGSPEAK_API_URL,
    },
  };
};
