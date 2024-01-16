import { useEffect, useState } from 'react';
import { api } from '../../libs';
import { messages } from '../../utils';
import { AuthContext } from './auth-context';

const NODE_ENV = 'development';
const USER_ID = '63a5a7dbdf89570016bf95e6';

const getSession = () => api.v1.auth().get('/users/me');
const logout = () => api.v1.auth().delete('/auth/logout');
const devSignIn = () => api.v1.post('/auth/local-sign-in', { user: USER_ID });

function AuthProvider({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function validateSession() {
      if (NODE_ENV === 'development') {
        const { data } = await devSignIn();

        onLoginOauth(data.data);
      } else {
          try {
            const { data } = await getSession();
      
            setSession(data.data);
            setIsSignedIn(true);
          } catch (err) {
            console.log(messages.failedToFetch);
          }
        }
        
        setIsValidating(false);
      }

      validateSession();
  }, []);

  const onLogin = async (username, password) => {
    try {
      const data = { username, fullName: 'Test User', initials: 'Y M', role: 'admin' }

      setSession(data);
      setIsSignedIn(true);
    } catch (err) {
      console.log(`${messages.fetchOperationFailed}: ${err.message}`);

      throw err;
    }
  };

  const onLoginOauth = async (tokens) => {
    try {
      api.setAuth(tokens);

      const { data } = await getSession();

      console.log(data);

      setSession(data.data);
      setIsSignedIn(true);
    } catch (err) {
      console.log(`${messages.fetchOperationFailed}: ${err.message}`);

      throw err;
    }
  };

  const onLogout = async () => {
    await logout();

    api.setAuth({
      accessToken: null,
      refreshToken: null
    });

    setIsSignedIn(false);
  };


  return (
    <AuthContext.Provider
      value={{
        isValidating,
        isSignedIn,
        session,
        onLogin,
        onLogout,
        onLoginOauth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
