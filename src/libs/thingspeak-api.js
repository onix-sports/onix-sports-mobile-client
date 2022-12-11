import axios from 'axios';
import Constants from 'expo-constants';

const instance = axios.create({
  baseURL: 'http://localhost:3010',
});

const getChannelStatus = (channelId, apiKey) =>
  instance.get(`channels/${channelId}/status.json`, {
    params: {
      api_key: apiKey,
      results: 0,
    },
  });

export { instance as thingSpeakApi, getChannelStatus };
