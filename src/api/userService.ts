import axios from './axios';

export interface UserProfileResponse {
    userId: string;
    username: string;
    email: string;
    role: string;
    createdDate: string;
    lastLoginDate?: string;
    isActive: number;
    mobileNumber?: string;
    studentId?: string;
    faculty?: string;
    year?: string;
    address?: string;
    city?: string;
    dateOfBirth?: string;
    profilePictureUrl?: string;
}

export interface UpdateProfileRequest {
    username?: string;
    mobileNumber?: string;
    faculty?: string;
    year?: string;
    address?: string;
    city?: string;
    dateOfBirth?: string;
}

const userService = {
    getUserProfile: async (userId: string): Promise<UserProfileResponse> => {
        const response = await axios.get(`/User/${userId}`);
        return response.data.data;
    },

    updateUserProfile: async (userId: string, request: UpdateProfileRequest): Promise<UserProfileResponse> => {
        const response = await axios.put(`/User/${userId}/profile`, request);
        return response.data.data;
    },

    uploadProfilePicture: async (userId: string, file: File): Promise<{ profilePictureUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`/User/${userId}/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }
};

export default userService;
