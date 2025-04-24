import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    user: null,  // Add user object
    isLoading: true
  });

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await fetchUserProfile(token);
        setAuthState({
          isLoggedIn: true,
          token,
          user: userData,
          isLoading: false
        });
      } else {
        setAuthState({
          isLoggedIn: false,
          token: null,
          user: null,
          isLoading: false
        });
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (token) => {
    localStorage.setItem('token', token);
    const userData = await fetchUserProfile(token);
    setAuthState({
      isLoggedIn: true,
      token,
      user: userData,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isLoggedIn: false,
      token: null,
      user: null,
      isLoading: false
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn: authState.isLoggedIn,
      token: authState.token,
      user: authState.user,
      isLoading: authState.isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};