const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Login failed');
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },
};

export const getSubdomain = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // For development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost';
  }
  
  // For production (subdomain.vercel.com)
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return hostname;
};