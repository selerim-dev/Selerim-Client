'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AuthState, 
  User, 
  UserLogin
} from '../interfaces/auth';
import authService, { tokenStorage } from './auth';

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: { access_token: string; refresh_token: string } } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  loginWithTokens: (tokens: { access_token: string; refresh_token: string }, user: User) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { accessToken, refreshToken } = tokenStorage.getTokens();
        const user = tokenStorage.getUser();

        if (accessToken && refreshToken && user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              tokens: { access_token: accessToken, refresh_token: refreshToken }
            }
          });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        tokenStorage.clearAll();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, [router]);

  // Login function
  const login = async (credentials: UserLogin) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);
      
      // Store tokens and user data
      tokenStorage.setTokens(response.access_token, response.refresh_token);
      tokenStorage.setUser(response.user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          tokens: { 
            access_token: response.access_token, 
            refresh_token: response.refresh_token 
          }
        }
      });

      // Route based on user role
      if (response.user.role === 'owner' || response.user.role === 'admin') {
        router.push('/owner');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Login with tokens (for account setup)
  const loginWithTokens = async (tokens: { access_token: string; refresh_token: string }, user: User) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Store tokens and user data
      tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
      tokenStorage.setUser(user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: user,
          tokens: { 
            access_token: tokens.access_token, 
            refresh_token: tokens.refresh_token 
          }
        }
      });

      // Route based on user role
      if (user.role === 'owner' || user.role === 'admin') {
        router.push('/owner');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.tokens?.access_token) {
        await authService.logout(state.tokens.access_token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStorage.clearAll();
      dispatch({ type: 'AUTH_LOGOUT' });
      router.push('/login');
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.forgotPassword(email);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Confirm password reset
  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.resetPassword(token, newPassword);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refresh auth (for token refresh)
  const refreshAuth = async () => {
    try {
      const { refreshToken } = tokenStorage.getTokens();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      
      // Update stored tokens and user
      tokenStorage.setTokens(response.access_token, response.refresh_token);
      tokenStorage.setUser(response.user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          tokens: { 
            access_token: response.access_token, 
            refresh_token: response.refresh_token 
          }
        }
      });
    } catch (error) {
      console.error('Auth refresh failed:', error);
      // If refresh fails, logout
      tokenStorage.clearAll();
      dispatch({ type: 'AUTH_LOGOUT' });
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithTokens,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    clearError,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
