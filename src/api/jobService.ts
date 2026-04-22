import axios, { axiosPrivate } from './axios';
import { ApiResponse } from './authService';

export interface PostedByInfo {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  mobileNumber?: string;
}

export interface JobResponse {
  id: string;
  title: string;
  company: string;
  location: string;
  payRange: string;
  jobType: string;
  category: string;
  logo: string | null;
  description: string;
  longDescription: string | null;
  requirements: string[] | null;
  tags: string[] | null;
  isNew: boolean;
  postedBy: PostedByInfo;
  createdAt: string;
  postedAt: string;
}

export interface PagedJobResponse {
  items: JobResponse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  payRange: string;
  jobType: string;
  category: string;
  logo?: string;
  description: string;
  longDescription?: string;
  requirements?: string[];
  tags?: string[];
  isNew?: boolean;
}

export interface UpdateJobData {
  title?: string;
  company?: string;
  location?: string;
  payRange?: string;
  jobType?: string;
  category?: string;
  logo?: string;
  description?: string;
  longDescription?: string;
  requirements?: string[];
  tags?: string[];
  isNew?: boolean;
}

const jobService = {
  getAllJobs: async (page: number = 1, pageSize: number = 10): Promise<PagedJobResponse> => {
    const response = await axios.get<ApiResponse<PagedJobResponse>>('/job', {
      params: { page, pageSize },
    });
    return response.data.data;
  },

  getNewJobs: async (): Promise<JobResponse[]> => {
    const response = await axios.get<ApiResponse<JobResponse[]>>('/job/new');
    return response.data.data;
  },

  getJobsByCategory: async (category: string): Promise<JobResponse[]> => {
    const response = await axios.get<ApiResponse<JobResponse[]>>(`/job/category/${category}`);
    return response.data.data;
  },

  getJobsByType: async (jobType: string): Promise<JobResponse[]> => {
    const response = await axios.get<ApiResponse<JobResponse[]>>(`/job/type/${jobType}`);
    return response.data.data;
  },

  searchJobs: async (query: string): Promise<JobResponse[]> => {
    const response = await axios.get<ApiResponse<JobResponse[]>>('/job/search', {
      params: { q: query }
    });
    return response.data.data;
  },

  getJobById: async (id: string): Promise<JobResponse> => {
    const response = await axios.get<ApiResponse<JobResponse>>(`/job/${id}`);
    return response.data.data;
  },

  uploadLogo: async (file: File): Promise<string> => {
    const token = localStorage.getItem('auth_accessToken');
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosPrivate.post<ApiResponse<{ url: string }>>('/job/upload-logo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data.url;
  },

  createJob: async (data: CreateJobData): Promise<JobResponse> => {
    const token = localStorage.getItem('auth_accessToken');
    const response = await axiosPrivate.post<ApiResponse<JobResponse>>('/job', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  updateJob: async (id: string, data: UpdateJobData): Promise<JobResponse> => {
    const token = localStorage.getItem('auth_accessToken');
    const response = await axiosPrivate.put<ApiResponse<JobResponse>>(`/job/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    const token = localStorage.getItem('auth_accessToken');
    await axiosPrivate.delete(`/job/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
};

export default jobService;
