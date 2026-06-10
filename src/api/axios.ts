import axios from 'axios';

//const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nearusab.me/api';
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const defaultAxios = axios.create({
    baseURL: BASE_URL
});

export default defaultAxios;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Static Request Interceptor: Automatically inject the access token if present
axiosPrivate.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_accessToken');
        if (!config.headers['Authorization'] && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Static Response Interceptor: Handle 401 Unauthorized errors and auto-refresh
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosPrivate(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('auth_refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                // Clear state on invalid session
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_accessToken');
                localStorage.removeItem('auth_refreshToken');
                window.dispatchEvent(new Event('auth_logout'));
                return Promise.reject(error);
            }

            try {
                // Perform token refresh using unintercepted axios instance to avoid loops
                const response = await defaultAxios.post('/auth/refresh', {
                    refreshToken
                });

                const tokenData = response.data?.data;
                const newAccessToken = tokenData?.accessToken;
                const newRefreshToken = tokenData?.refreshToken || refreshToken;

                if (!newAccessToken) {
                    throw new Error('Refresh response missing access token');
                }

                // Update storage
                localStorage.setItem('auth_accessToken', newAccessToken);
                localStorage.setItem('auth_refreshToken', newRefreshToken);

                // Broadcast refreshed token to dynamic components
                window.dispatchEvent(new CustomEvent('auth_token_refreshed', { detail: newAccessToken }));

                // Process requests in queue with the new token
                processQueue(null, newAccessToken);
                isRefreshing = false;

                // Retry original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear credentials and logout
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_accessToken');
                localStorage.removeItem('auth_refreshToken');
                window.dispatchEvent(new Event('auth_logout'));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

