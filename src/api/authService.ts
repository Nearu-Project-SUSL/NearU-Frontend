import axios from './axios';

// Backend ApiResponse wrapper interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  fullName: string;
  email: string;
  password: string;
  studentId: string;
  faculty: string;
  year: string;
  phone: string;
  address: string;
  city: string;
  dateOfBirth: string;
  emergencyContact: string;
}

export interface RegisterBusinessData {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  phone: string;
  businessType: string;
  address: string;
  description: string;
  registrationNumber: string;
  taxId?: string;
}

export interface RegisterRiderData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  address: string;
  emergencyContact: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<ApiResponse<any>>('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    // Extract data from ApiResponse wrapper
    const apiData = response.data.data;
    
    // Map backend response to our AuthResponse format
    return {
      accessToken: apiData.accessToken,
      refreshToken: apiData.refreshToken,
      user: {
        id: apiData.userId,
        username: apiData.username,
        email: apiData.email,
        roles: apiData.role ? [apiData.role] : []
      }
    };
  },

  registerStudent: async (data: RegisterStudentData): Promise<{ message: string, userId: string, username: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/register', {
        username: data.fullName,
        email: data.email,
        password: data.password
    });
    
    // Extract from ApiResponse wrapper
    return {
      message: response.data.message,
      userId: response.data.data.userId,
      username: response.data.data.username
    };
  },

  registerBusiness: async (data: RegisterBusinessData): Promise<{ message: string, userId: string, username: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/register', {
        username: data.ownerName,
        email: data.email,
        password: data.password
    });
    
    // Extract from ApiResponse wrapper
    return {
      message: response.data.message,
      userId: response.data.data.userId,
      username: response.data.data.username
    };
  },

  registerRider: async (data: RegisterRiderData): Promise<{ message: string, userId: string, username: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/register', {
        username: data.fullName,
        email: data.email,
        password: data.password
    });
    
    // Extract from ApiResponse wrapper
    return {
      message: response.data.message,
      userId: response.data.data.userId,
      username: response.data.data.username
    };
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/forgot-password', data);
    return { message: response.data.message };
  },

  verifyResetCode: async (data: VerifyCodeData): Promise<{ message: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/verify-reset-code', data);
    return { message: response.data.message };
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/reset-password', data);
    return { message: response.data.message };
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await axios.post<ApiResponse<any>>('/auth/change-password', data);
    return { message: response.data.message };
  },

  logout: async (): Promise<void> => {
    await axios.post('/auth/logout');
  },
};

export default authService;
