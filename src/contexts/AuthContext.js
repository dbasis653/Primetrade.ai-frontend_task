import { createContext, useContext } from "react";

export const AuthContext = createContext({
  // State stubs
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Action stubs (all 10 backend endpoints)
  register: (userData) => {},
  login: (credentials) => {},
  logout: () => {},
  verifyEmail: (token) => {},
  forgotPassword: (email) => {},
  resetPassword: (token, newPassword) => {},
  changePassword: (oldPassword, newPassword) => {},
  resendVerification: () => {},
  refreshToken: () => {},
  clearError: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = AuthContext.Provider;
