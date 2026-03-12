import axios from 'axios';

// Replace string with environment variable containing your ASP.NET backend URL
const BASE_URL = 'http://localhost:5000/api'; 

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
