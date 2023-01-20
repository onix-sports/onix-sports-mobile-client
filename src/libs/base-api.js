import axios from 'axios';
import Constants from 'expo-constants';

class Api {
  constructor() {
    this.v1 = this.createApi({
      baseURL: `${Constants.expoConfig.extra.baseApiUrl}/v1`,
    });
  }

  get authorization() {
    return `Bearer ${this._accessToken}`;
  }

  createApi(config) {
    const api = axios.create(config);

    const apiWithAuth = axios.create(config);

    apiWithAuth.interceptors.request.use((config) => {
        config.headers.authorization = this.authorization;

        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    api.auth = () => apiWithAuth;

    api.url = config.baseURL;

    return api;
  }

  setAuth(tokens) {
    this._accessToken = tokens.accessToken;
    this._refreshToken = tokens.refreshToken;
  }
}

const api =  new Api();

export { api };
