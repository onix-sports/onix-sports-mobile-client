module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      baseApiUrl: process.env.API_URL || 'https://onix-sports-old.herokuapp.com',
      thingSpeakApiUrl: process.env.THINGSPEAK_API_URL,
    },
  };
};
