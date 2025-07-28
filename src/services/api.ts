import { API_URL } from "./common";

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
  total?: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

export interface LoginResponse {
  accessToken: string;
}

export interface StorageKeyResponse {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
  isDefault: boolean;
}

export interface StoryResponse {
  title: string;
  date: string;
  description: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  config: {
    brideAccountName: string;
    brideAccountNumber: string;
    brideAddress: string;
    brideGgAddress: string;
    brideName: string;
    brideBankId: number;
    groomIntroduction: string;
    brideIntroduction: string;
    groomAccountName: string;
    groomAccountNumber: string;
    groomAddress: string;
    groomGgAddress: string;
    groomName: string;
    groomBankId: number;
    lunarDate: string;
    solarDate: Date;
    weddingHours: string;
    storageKey: StorageKeyResponse[];
    story: StoryResponse[];
    audios: string[];
    brideLunarDate: string;
    brideSolarDate: Date;
    brideWeddingHours: string;
  };
}

export interface StorageKeyRequest {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
  isDefault: boolean;
}

export interface StoryRequest {
  title: string;
  date: string;
  description: string;
}

export interface UpdateConfigRequest {
  brideAccountName?: string;
  brideAccountNumber?: string;
  brideAddress?: string;
  brideGgAddress?: string;
  brideBank?: Banks;
  brideName?: string;
  groomIntroduction?: string;
  brideIntroduction?: string;
  groomAccountName?: string;
  groomAccountNumber?: string;
  groomAddress?: string;
  groomGgAddress?: string;
  groomBank?: Banks;
  groomName?: string;
  solarDate?: string;
  lunarDate?: string;
  weddingHours?: string;
  storageKey?: StorageKeyRequest[];
  story?: StoryRequest[];
  audios?: string[];
  brideSolarDate?: string;
  brideLunarDate?: string;
  brideWeddingHours?: string;
}

export interface UpdateProfileRequest {
  config: UpdateConfigRequest;
}

export enum EGuestOfType {
  GROOM = "groom",
  BRIDE = "bride",
}

export enum EConfirmAttended {
  ATTENDANCE = "attendance",
  NOT_ATTENDANCE = "not_attendance",
  NOT_CONFIRM = "not_confirm",
}

export enum ESpender {
  HUSBAND = "husband",
  WIFE = "wife",
}

export interface GetGuestResponse {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string;
  relation: string;
  facebook: string;
  isInvite: boolean;
  invitationText: string;
  confirmAttended: EConfirmAttended;
  isAttended: boolean;
  giftAmount: string;
  note: string;
}

export interface GetTrafficResponse {
  id: string;

  name: string;

  guestOf: string;

  sessionDuration: number;

  ipAddress: string;

  deviceType: string;

  source: string;

  isOnline: boolean;

  createdAt: Date;
}

export interface GetStatisticResponse {
  groom: {
    invitedCount: number;
    attendingCount: number;
    notAttendingCount: number;
    weddingGiftCount: number;
    noGiftCount: number;
    noShowButGiftCount: number;
    totalGiftMoney: number;
    totalGiftGold: string;
  };
  bride: {
    invitedCount: number;
    attendingCount: number;
    notAttendingCount: number;
    weddingGiftCount: number;
    noGiftCount: number;
    noShowButGiftCount: number;
    totalGiftMoney: number;
    totalGiftGold: string;
  };
  all: {
    invitedCount: number;
    attendingCount: number;
    notAttendingCount: number;
    weddingGiftCount: number;
    noGiftCount: number;
    noShowButGiftCount: number;
    totalGiftMoney: number;
    totalGiftGold: string;
  };
  husbandSpend: number;
  wifeSpend: number;
  allSpend: number;
}

export interface GetGuestsRequest {
  size?: number;
  page?: number;
  keyword?: string;
  guestOf: EGuestOfType;
}

export interface GetTrafficsRequest {
  size?: number;
  page?: number;
  // keyword?: string;
}

export interface CreateGuestRequest {
  guestOf: EGuestOfType;
  name: string;
  slug: string;
  phoneNumber?: string;
  relation?: string;
  invitationText?: string;
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

export interface GetExpensesRequest {
  size?: number;
  page?: number;
  keyword?: string;
}

export interface CreateExpenseRequest {
  name: string;
  amount: number;
  spender: ESpender;
}

export interface UpdateExpenseRequest {
  name?: string;
  amount?: number;
  spender?: ESpender;
}

export interface DeleteExpenseRequest {
  expenseIds: string[];
}

export interface GetExpenseResponse {
  id: string;
  name: string;
  amount: number;
  spender: ESpender;
}

export interface Banks {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Login failed");
        }
      }

      const apiResponse: ApiResponse<LoginResponse> = await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Login failed");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  getProfile: async (token: string): Promise<UserProfile> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch profile");
        }
      }

      const apiResponse: ApiResponse<UserProfile> = await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch profile");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  updateProfile: async (
    token: string,
    profileData: UpdateProfileRequest
  ): Promise<UserProfile> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to update profile");
        }
      }

      const apiResponse: ApiResponse<UserProfile> = await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to update profile");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  getListBank: async (): Promise<Banks[]> => {
    try {
      const response = await fetch(`https://api.vietqr.io/v2/banks`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch list bank");
      }

      const apiResponse = await response.json();

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

export const guestAPI = {
  getGuests: async (
    token: string,
    params: GetGuestsRequest
  ): Promise<GetGuestResponse[]> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const queryParams = new URLSearchParams();
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.keyword) queryParams.append("keyword", params.keyword);
      queryParams.append("guestOf", params.guestOf);

      const response = await fetch(
        `${API_URL}/v1/users/guests?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch guests");
        }
      }

      const apiResponse: ApiResponse<GetGuestResponse[]> =
        await response.json();

      console.log("API: getGuests raw response:", apiResponse);

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch guests");
      }

      console.log("API: getGuests returning data:", apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  createGuest: async (
    token: string,
    guestData: CreateGuestRequest
  ): Promise<GetGuestResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to create guest");
        }
      }

      const apiResponse: ApiResponse<GetGuestResponse> = await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to create guest");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  updateGuest: async (
    token: string,
    guestId: string,
    guestData: UpdateGuestRequest
  ): Promise<GetGuestResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests/${guestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to update guest");
        }
      }

      const apiResponse: ApiResponse<GetGuestResponse> = await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to update guest");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  deleteGuests: async (token: string, guestIds: string[]): Promise<boolean> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/guests/delete-bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestIds }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to delete guests");
        }
      }

      const apiResponse: ApiResponse<boolean> = await response.json();

      if (apiResponse.code !== 200) {
        throw new Error("Failed to delete guests");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

export const trafficAPI = {
  getTraffics: async (
    token: string,
    params: GetTrafficsRequest
  ): Promise<ApiResponse<GetTrafficResponse[]>> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const queryParams = new URLSearchParams();
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.page) queryParams.append("page", params.page.toString());

      const response = await fetch(
        `${API_URL}/v1/users/traffics?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch guests");
        }
      }

      const apiResponse: ApiResponse<GetTrafficResponse[]> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch guests");
      }

      return apiResponse;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

export const statisticAPI = {
  get: async (token: string): Promise<GetStatisticResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/statistics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch statistics");
        }
      }

      const apiResponse: ApiResponse<GetStatisticResponse> =
        await response.json();
      console.log(apiResponse);

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch statistics");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

export const expenseAPI = {
  getExpenses: async (
    token: string,
    params: GetExpensesRequest
  ): Promise<GetExpenseResponse[]> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const queryParams = new URLSearchParams();
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.keyword) queryParams.append("keyword", params.keyword);

      const response = await fetch(
        `${API_URL}/v1/users/expenses?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch guests");
        }
      }

      const apiResponse: ApiResponse<GetExpenseResponse[]> =
        await response.json();

      console.log("API: getExpenses raw response:", apiResponse);

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch expenses");
      }

      console.log("API: getExpenses returning data:", apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  createExpense: async (
    token: string,
    expenseData: CreateExpenseRequest
  ): Promise<GetExpenseResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to create expense");
        }
      }

      const apiResponse: ApiResponse<GetExpenseResponse> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to create expense");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  updateExpense: async (
    token: string,
    expenseId: string,
    expenseData: UpdateExpenseRequest
  ): Promise<GetExpenseResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(
        `${API_URL}/v1/users/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to update expense");
        }
      }

      const apiResponse: ApiResponse<GetExpenseResponse> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to update expense");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  deleteExpenses: async (
    token: string,
    expenseIds: string[]
  ): Promise<boolean> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/users/expenses/delete-bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenseIds }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to delete expenses");
        }
      }

      const apiResponse: ApiResponse<boolean> = await response.json();

      if (apiResponse.code !== 200) {
        throw new Error("Failed to delete expenses");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

// Image API Types
export enum EImageStoreType {
  CAROUSEL = "carousel",
  STORY = "story",
  SWEET_MOMENTS = "sweet_moments",
  FOOTER = "footer",
  INVITATION = "invitation",
  COUPLE = "couple",
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
  imagePath: string;
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
      throw new Error("No token provided");
    }

    if (!request) {
      throw new Error("Upload request is required");
    }

    try {
      const formData = new FormData();
      formData.append("type", request.type.toString());

      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Add URLs if provided
      if (request.urls && request.urls.length > 0) {
        formData.append("urls", request.urls.join(","));
      }

      const response = await fetch(`${API_URL}/v1/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to upload images");
        }
      }

      const apiResponse: ApiResponse<UploadImageResponse[]> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to upload images");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  getImages: async (
    token: string,
    type: EImageStoreType
  ): Promise<GetImageResponse[]> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("type", type);

      const response = await fetch(`${API_URL}/v1/images?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to fetch images");
        }
      }

      const apiResponse: ApiResponse<GetImageResponse[]> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to fetch images");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  bulkDeleteImages: async (
    token: string,
    request: BulkDeleteImagesRequest
  ): Promise<BulkDeleteResponse> => {
    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const response = await fetch(`${API_URL}/v1/images/bulk-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to delete images");
        }
      }

      const apiResponse: ApiResponse<BulkDeleteResponse> =
        await response.json();

      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to delete images");
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },

  uploadImageWithName: async (
    token: string,
    file: File,
    name: string,
    url?: string
  ): Promise<string> => {
    if (!token) {
      throw new Error("No token provided");
    }
    if (!file && !url) {
      throw new Error("File or URL is required");
    }
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("name", name);
      if (url) {
        formData.append("url", url);
      }
      const response = await fetch(`${API_URL}/v1/images/upload-one`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Failed to upload image");
        }
      }
      const apiResponse: ApiResponse<string> = await response.json();
      if (apiResponse.code !== 200 || !apiResponse.data) {
        throw new Error("Failed to upload image");
      }
      return apiResponse.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error");
      }
      throw error;
    }
  },
};

export const getSubdomain = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    parts[0] === "192"
  ) {
    return "vuongninh";
  }

  if (parts.length >= 3) {
    return parts[0];
  }

  return hostname;
};
