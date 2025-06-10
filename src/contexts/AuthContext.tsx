import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState({
    accessToken: null as string | null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        const isValidToken = token && 
                           token.trim() && 
                           token !== 'undefined' && 
                           token !== 'null';
        
        if (isValidToken) {
          setState({
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem('accessToken');
          setState({
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        setState({
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    const timeoutId = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const login = useCallback((token: string) => {
    if (!token || token.trim() === '' || token === 'undefined' || token === 'null') {
      throw new Error('Token không hợp lệ');
    }
    
    try {
      localStorage.setItem('accessToken', token);
      setState({
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error('Không thể lưu thông tin đăng nhập');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
    setState({
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const value = {
    isAuthenticated: state.isAuthenticated,
    accessToken: state.accessToken,
    isLoading: state.isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};