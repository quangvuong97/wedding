const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface LoginRequest {
  username: string;
  password: string;
}

// API Response wrapper
interface ApiResponse<T> {
  code: number;
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginResponse {
  accessToken: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  config: {
    groomName: string;
    QRCodeGroomUrl: string;
    brideName: string;
    QRCodeBrideUrl: string;
    weddingDate: Date;
  };
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

      const apiResponse: ApiResponse<LoginResponse> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Login failed');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  getProfile: async (token: string): Promise<UserProfile> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to fetch profile');
        }
      }

      const apiResponse: ApiResponse<UserProfile> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to fetch profile');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return false;
      }
      
      const apiResponse: ApiResponse<UserProfile> = await response.json();
      return apiResponse.code === 200 && !!apiResponse.data;
    } catch (error) {
      return false;
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