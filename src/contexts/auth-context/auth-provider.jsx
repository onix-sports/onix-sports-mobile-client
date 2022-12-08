import { useEffect, useState } from 'react';
import { baseApi } from '../../libs';
import { messages } from '../../utils';
import { AuthContext } from './auth-context';

// const getSession = () => baseApi.get('/auth/user');
const getSession = () => Promise.resolve({ data: { username: 'ya_myn', fullName: 'Test User', initials: 'initials' } })

const login = (data) => baseApi.post('/auth/login', data);

const logout = (data) => baseApi.post('/auth/logout', data);

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
      //MOCK
      // await login({ username, password });
      //
      //
      // const { data } = await getSession();
      ///

      const data = { username, fullName: 'Test User', initials: 'initials' }
      setSession(data);
      setIsSignedIn(true);
    } catch (err) {
      console.log(`${messages.fetchOperationFailed}: ${err.message}`);
      throw err;
    }
  };

  const onLogout = async () => {
    await logout();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
