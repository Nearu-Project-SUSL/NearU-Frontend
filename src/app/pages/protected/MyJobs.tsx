import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { JobResponse } from '../../../api/jobService';
import { useAllJobs, useDeleteJob } from '../../hooks/useJobs';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import useAuth from '../../hooks/useAuth';

import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Avatar,
  Fade,
  Grow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Divider,
  Skeleton,
} from '@mui/material';

import {
  LocationOn as LocationIcon,
  AttachMoney as PayIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  WorkOutline as WorkIcon,
} from '@mui/icons-material';

function formatDate(dateString: string) {
    if (!dateString) return '';
    try {
        const d = new Date(dateString);
        return formatDistanceToNow(d, { addSuffix: true });
    } catch (e) {
        return '';
    }
}

function MyJobListSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                overflow: 'hidden',
            }}
        >
            <Box sx={{ p: 4, flex: 1, display: 'flex', gap: 3, alignItems: 'center' }}>
                <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Box flex={1}>
                    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 0.5, bgcolor: 'rgba(255,255,255,0.05)' }} />
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.05)' }} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                        <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ p: 4, borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.05)' }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5, bgcolor: 'rgba(255,255,255,0.01)', minWidth: 200 }}>
                <Skeleton variant="rounded" height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="rounded" height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="rounded" height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Box>
        </Card>
    );
}

export default function MyJobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: allJobs = [], isLoading: loading, isError, error } = useAllJobs();
  const deleteJobMutation = useDeleteJob();
  
  const { auth } = useAuth();
  const userId = auth?.user?.id;
  const myJobs = allJobs.filter(job => job.postedBy.userId === userId);

  useEffect(() => {
    if (isError) {
      toast.error((error as any)?.response?.data?.message || 'Failed to fetch your jobs');
    }
  }, [isError, error]);

  const handleJobClick = (job: JobResponse) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }

    try {
      await deleteJobMutation.mutateAsync(jobId);
      toast.success('Job listing deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar />
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 1000, mx: 'auto', width: '100%' }}>
              
              <Fade in={true} timeout={600}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 2 }}>
                    My Posted <span style={{ color: '#facc15' }}>Jobs</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6 }}>
                    Manage the job opportunities you have posted.
                  </Typography>

                  {loading ? (
                    <Grid container spacing={3}>
                      {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12 }} key={i}>
                          <MyJobListSkeleton />
                        </Grid>
                      ))}
                    </Grid>
                  ) : myJobs.length > 0 ? (
                    <Grid container spacing={3}>
                      {myJobs.map((job, index) => (
                        <Grid size={{ xs: 12 }} key={job.id}>
                          <Grow in timeout={400 + index * 100}>
                              <Card
                                  elevation={0}
                                  sx={{
                                      bgcolor: 'rgba(255,255,255,0.02)',
                                      borderRadius: '24px',
                                      border: '1px solid rgba(255, 255, 255, 0.05)',
                                      display: 'flex',
                                      flexDirection: { xs: 'column', md: 'row' },
                                      overflow: 'hidden',
                                  }}
                              >
                                  <Box sx={{ p: 4, flex: 1, display: 'flex', gap: 3, alignItems: 'center' }}>
                                      <Avatar src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=facc15&color=000&bold=true`} variant="rounded" sx={{ width: 64, height: 64, borderRadius: '16px' }} />
                                      <Box flex={1}>
                                          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>{job.title}</Typography>
                                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1.5 }}>{job.company}</Typography>
                                          <Box sx={{ display: 'flex', gap: 2 }}>
                                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                  <TimeIcon sx={{ fontSize: 14 }} /> Posted on {formatDate(job.createdAt)}
                                              </Typography>
                                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                  <LabelIcon sx={{ fontSize: 14 }} /> {job.jobType}
                                              </Typography>
                                          </Box>
                                      </Box>
                                  </Box>
                                  <Box sx={{ p: 4, borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.05)' }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5, bgcolor: 'rgba(255,255,255,0.01)', minWidth: 200 }}>
                                      <Button onClick={() => handleJobClick(job)} variant="outlined" sx={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.4)', borderRadius: '12px' }}>
                                          View Details
                                      </Button>
                                      <Button onClick={() => navigate(`/jobs/update/${job.id}`)} variant="contained" sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '12px', fontWeight: 700 }}>
                                          Update Listing
                                      </Button>
                                      <Button onClick={() => handleDeleteJob(job.id)} variant="contained" color="error" sx={{ borderRadius: '12px', fontWeight: 700 }}>
                                          Delete Listing
                                      </Button>
                                  </Box>
                              </Card>
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <WorkIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>You haven't posted any jobs yet.</Typography>
                        <Button href="/jobs/create" variant="contained" sx={{ mt: 3, bgcolor: '#facc15', color: '#000', fontWeight: 700, borderRadius: '12px' }}>
                            Post a Job Now
                        </Button>
                    </Box>
                  )}

                </Box>
              </Fade>

            </Box>
          </Box>
      </Box>

      {/* Reusing dialog for view details... */}
      <Dialog 
        open={isDetailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: {
            bgcolor: '#0a0a0a',
            borderRadius: { xs: 0, md: '32px' },
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundImage: 'none',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
            m: { xs: 0, md: 2 }
          }
        }}
      >
        {selectedJob && (
            <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" color="white" fontWeight="bold">{selectedJob.title}</Typography>
                    <IconButton onClick={handleCloseDetails} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </Box>
                <Typography variant="body1" color="rgba(255,255,255,0.7)">{selectedJob.longDescription}</Typography>
                {/* Simplified view since it's just for the poster to review */}
            </Box>
        )}
      </Dialog>
    </Box>
  );
}
