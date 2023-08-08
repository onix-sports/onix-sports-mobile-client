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
        config.headers.Authorization = this.authorization;

        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    apiWithAuth.interceptors.response.use(
        async (response) => {
        if (response.data?.data?.meta?.auth?.updateAccessToken) {
          const success = await this.updateAccess();

          if (!success) {
            return 'redirect to login';
          }
        }

        return response;
      },
      async (error) => {
        const config = error?.config;
    
        if (error?.response?.status === 401 && !config?.sent) {
          config.sent = true;
    
          const success = await this.updateAccess();

          if (success) {
            return axios(config);
          } else {
            return 'redirect to login';
          }
        }
        return Promise.reject(error);
      }
    );

    api.auth = () => apiWithAuth;

    api.url = config.baseURL;

    return api;
  }

  setAuth(tokens) {
    this._accessToken = tokens.accessToken;
    this._refreshToken = tokens.refreshToken;
  }

  setAccessToken(token) {
    this._accessToken = token;
  }

  getAccessToken() {
    return this.v1.post('/auth/refresh-token', { refreshToken: this._refreshToken })
      .then(({ data }) => data.data.accessToken)
      .catch(() => null);
  }

  async updateAccess() {
    const token = await this.getAccessToken();

    if (token) {
      this.setAccessToken(token);

      return true;
    } else {
      return false;
    }
  }
}

const api =  new Api();

export { api };
