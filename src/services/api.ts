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

export interface StorageKeyResponse {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
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
    storageKey: StorageKeyResponse;
  };
}

export interface StorageKeyRequest {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}

export interface UpdateConfigRequest {
  groomName?: string;
  brideName?: string;
  QRCodeGroomUrl?: string;
  QRCodeBrideUrl?: string;
  weddingDate?: Date;
  storageKey?: StorageKeyRequest;
}

export interface UpdateProfileRequest {
  config: UpdateConfigRequest;
}

export enum EGuestOfType {
  GROOM = "groom",
  BRIDE = "bride",
}

export interface GetGuestResponse {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string;
  relation: string;
  facebook: string;
  isInvite: boolean;
  isAttended: boolean;
  giftAmount: string;
  note: string;
}

export interface GetGuestsRequest {
  size?: number;
  page?: number;
  keyword?: string;
  guestOf: EGuestOfType;
}

export interface CreateGuestRequest {
  guestOf: EGuestOfType;
  name: string;
  slug: string;
  phoneNumber?: string;
  relation?: string;
  facebook?: string;
  note?: string;
  isInvite?: boolean;
  isAttended?: boolean;
  giftAmount?: string;
}

export interface UpdateGuestRequest {
  name?: string;
  slug?: string;
  phoneNumber?: string;
  relation?: string;
  facebook?: string;
  note?: string;
  isInvite?: boolean;
  isAttended?: boolean;
  giftAmount?: string;
}

export interface DeleteGuestRequest {
  guestIds: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
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

  updateProfile: async (token: string, profileData: UpdateProfileRequest): Promise<UserProfile> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to update profile');
        }
      }

      const apiResponse: ApiResponse<UserProfile> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to update profile');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },
};

export const guestAPI = {
  getGuests: async (token: string, params: GetGuestsRequest): Promise<PaginatedResponse<GetGuestResponse>> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const queryParams = new URLSearchParams();
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.keyword) queryParams.append('keyword', params.keyword);
      queryParams.append('guestOf', params.guestOf);

      const response = await fetch(`${API_URL}/v1/users/guests?${queryParams}`, {
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
          throw new Error('Failed to fetch guests');
        }
      }

      const apiResponse: ApiResponse<PaginatedResponse<GetGuestResponse>> = await response.json();
      
      console.log('API: getGuests raw response:', apiResponse);
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to fetch guests');
      }
      
      console.log('API: getGuests returning data:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  createGuest: async (token: string, guestData: CreateGuestRequest): Promise<GetGuestResponse> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to create guest');
        }
      }

      const apiResponse: ApiResponse<GetGuestResponse> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to create guest');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  updateGuest: async (token: string, guestId: string, guestData: UpdateGuestRequest): Promise<GetGuestResponse> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests/${guestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to update guest');
        }
      }

      const apiResponse: ApiResponse<GetGuestResponse> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to update guest');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  deleteGuests: async (token: string, guestIds: string[]): Promise<boolean> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests/delete-bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestIds }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to delete guests');
        }
      }

      const apiResponse: ApiResponse<boolean> = await response.json();
      
      if (apiResponse.code !== 200) {
        throw new Error('Failed to delete guests');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },
};

// Image API Types
export enum EImageStoreType {
  CAROUSEL = "carousel",
  SWEET_MOMENTS = "sweet_moments",
  FOOTER = "footer",
}

export interface UploadImagesRequest {
  type: EImageStoreType;
  urls?: string[];
}

export interface BulkDeleteImagesRequest {
  type: EImageStoreType;
  imageIds: string[];
}

export interface GetImageResponse {
  id: string;
  imageId: string;
  imageUrl: string;
  type: EImageStoreType;
}

export interface UploadImageResponse {
  id: string;
  imageId: string;
  imageUrl: string;
}

export interface BulkDeleteResponse {
  success: boolean;
  deletedCount: number;
}

export const imageAPI = {
  uploadImages: async (
    token: string, 
    files?: File[], 
    request?: UploadImagesRequest
  ): Promise<UploadImageResponse[]> => {
    if (!token) {
      throw new Error('No token provided');
    }

    if (!request) {
      throw new Error('Upload request is required');
    }

    try {
      const formData = new FormData();
      formData.append('type', request.type.toString());

      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // Add URLs if provided
      if (request.urls && request.urls.length > 0) {
        formData.append('urls', request.urls.join(','));
      }

      const response = await fetch(`${API_URL}/v1/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to upload images');
        }
      }

      const apiResponse: ApiResponse<UploadImageResponse[]> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to upload images');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  getImages: async (token: string, type: EImageStoreType): Promise<GetImageResponse[]> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('type', type);

      const response = await fetch(`${API_URL}/v1/images?${queryParams}`, {
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
          throw new Error('Failed to fetch images');
        }
      }

      const apiResponse: ApiResponse<GetImageResponse[]> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to fetch images');
      }
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error');
      }
      throw error;
    }
  },

  bulkDeleteImages: async (token: string, request: BulkDeleteImagesRequest): Promise<BulkDeleteResponse> => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const response = await fetch(`${API_URL}/v1/images/bulk-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Failed to delete images');
        }
      }

      const apiResponse: ApiResponse<BulkDeleteResponse> = await response.json();
      
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error('Failed to delete images');
      }
      
      return apiResponse.data;
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
  if (hostname === 'localhost' || hostname === '127.0.0.1' || parts[0] === '192') {
    return 'vuongninh';
  }
  
  // For production (subdomain.vercel.com)
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return hostname;
};