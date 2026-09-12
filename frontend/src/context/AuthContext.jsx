import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login after page refresh
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');

      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error('AUTH RESTORE ERROR:', error);

      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      'userInfo',
      JSON.stringify(userData)
    );

    // Save token separately
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};