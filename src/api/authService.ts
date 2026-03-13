import axios from './axios';

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
  user: {
    id: string;
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
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  registerStudent: async (data: RegisterStudentData): Promise<AuthResponse> => {
    const response = await axios.post('/auth/register/student', data);
    return response.data;
  },

  registerBusiness: async (data: RegisterBusinessData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/register/business', data);
    return response.data;
  },

  registerRider: async (data: RegisterRiderData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/register/rider', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetCode: async (data: VerifyCodeData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/verify-reset-code', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await axios.post('/auth/change-password', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post('/auth/logout');
  },
};

export default authService;
