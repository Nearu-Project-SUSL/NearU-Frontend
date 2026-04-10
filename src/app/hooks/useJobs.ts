import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService, { CreateJobData, UpdateJobData } from '../../api/jobService';

export const JOB_QUERY_KEYS = {
  all: ['jobs', 'all'] as const,
  category: (category: string) => ['jobs', 'category', category] as const,
  type: (type: string) => ['jobs', 'type', type] as const,
  search: (query: string) => ['jobs', 'search', query] as const,
  detail: (id: string) => ['jobs', 'detail', id] as const,
};

// --- QUERIES --- //

export const useAllJobs = () => {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.all,
    queryFn: jobService.getAllJobs,
  });
};

export const useNewJobs = () => {
    return useQuery({
      queryKey: ['jobs', 'new'],
      queryFn: jobService.getNewJobs,
    });
};

// --- MUTATIONS --- //

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateJobData) => jobService.createJob(data),
    onSuccess: () => {
      // Invalidate the jobs list so it refetches immediately
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobData }) => jobService.updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
