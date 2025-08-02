import React from 'react';
import { loginUser, logoutUser } from '../features/auth/login.api';

const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  logout: () => {}
});

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  return context;
};

export function AuthProvider({ children }) {
  // Temporary simple implementation without hooks to avoid the current issue
  const authValue = {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: async (email, password) => {
      try {
        const response = await loginUser(email, password);
        return response;
      } catch (error) {
        throw error;
      }
    },
    logout: () => {
      logoutUser();
    },
  };

  return React.createElement(AuthContext.Provider, { value: authValue }, children);
}