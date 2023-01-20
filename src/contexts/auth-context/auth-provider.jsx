import { useEffect, useState } from 'react';
import { api } from '../../libs';
import { messages } from '../../utils';
import { AuthContext } from './auth-context';

// const getSession = () => api.v1.get('/auth/user');
const getSession = () => Promise.reject('error')

const logout = () => api.v1.auth().delete('/auth/logout');

function AuthProvider({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function validateSession() {
      try {
        const { data } = await getSession();
  
        setSession(data);
        setIsSignedIn(true);
      } catch (err) {
        console.log(messages.failedToFetch);
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
      const data = { username: 'ya myn', fullName: 'Test User', initials: 'Y M', role: 'admin', tokens };
      api.setAuth(tokens);
      setSession(data);
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
