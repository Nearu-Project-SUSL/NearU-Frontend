import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nearu-app-5ldre.ondigitalocean.app/api';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
