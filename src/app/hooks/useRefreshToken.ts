import axios from '../../api/axios';
import useAuth from './useAuth';
import { ApiResponse } from '../../api/authService';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.post<ApiResponse<any>>('/auth/refresh', {
                refreshToken: auth.refreshToken
            });
            
            // Extract from ApiResponse wrapper
            const tokenData = response.data.data;
            
            setAuth(prev => {
                return {
                    ...prev,
                    accessToken: tokenData.accessToken,
                    refreshToken: tokenData.refreshToken || prev.refreshToken
                }
            });
            
            return tokenData.accessToken;
        } catch (error) {
            // Handle refresh logic failure (e.g. redirect to login)
            console.error("Failed to refresh token", error);
            throw error;
        }
    };
    return refresh;
};

export default useRefreshToken;
