import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nearusab.me/api';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});
