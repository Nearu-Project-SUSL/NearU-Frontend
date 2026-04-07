import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { JobResponse } from '../../../api/jobService';
import { useAllJobs, useDeleteJob } from '../../hooks/useJobs';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

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
  MenuItem,
  TextField,
  InputAdornment,
  Skeleton
} from '@mui/material';

import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AttachMoney as PayIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  WorkOutline as WorkIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as SparkleIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  FilterList as FilterIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  AddCircleOutline as AddIcon
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

// ─── Custom Carousel Hook ─────────────────────────────────────────────────────
function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return { scrollRef, scroll };
}

// ─── Job Card Component ───────────────────────────────────────────────────────
function JobSkeleton({ index }: { index: number }) {
  return (
    <Grow in timeout={400 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: '100%', sm: 340 },
          maxWidth: { sm: 380 },
          bgcolor: 'rgba(255,255,255,0.02)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2.5 }}>
          <Skeleton variant="rounded" width={54} height={54} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Skeleton variant="text" width={40} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          </Box>
        </Box>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 0.5, bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
        
        <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
          <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Stack>

        <Box sx={{ mb: 3, width: '100%' }}>
          <Skeleton variant="text" width="100%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="text" width="90%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', width: '100%', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Box>
      </Card>
    </Grow>
  );
}

function JobCard({ job, index, onClick }: { job: JobResponse, index: number, onClick: (job: JobResponse) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Grow in timeout={400 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: '100%', sm: 340 },
          maxWidth: { sm: 380 },
          bgcolor: 'rgba(255,255,255,0.02)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          '&:hover': {
             borderColor: 'rgba(250, 204, 21, 0.3)',
             bgcolor: 'rgba(250, 204, 21, 0.02)',
             boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardActionArea
          onClick={() => onClick(job)}
          sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%' }}
        >
          {/* Top: Logo & Badges */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2.5 }}>
            <Avatar 
                src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=facc15&color=000&bold=true`} 
                variant="rounded"
                sx={{ 
                    width: 54, 
                    height: 54, 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: hovered ? '0 8px 16px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.3s ease'
                }} 
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                {job.isNew && (
                    <Chip 
                        label="NEW" 
                        size="small" 
                        sx={{ 
                            bgcolor: '#facc15', 
                            color: '#000', 
                            fontWeight: 800, 
                            fontSize: '0.65rem',
                            height: 20
                        }} 
                    />
                )}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimeIcon sx={{ fontSize: 12 }} /> {formatDate(job.createdAt)}
                </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, fontSize: '1.2rem', lineHeight: 1.3 }}>
            {job.title}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#facc15', fontWeight: 600, mb: 2, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {job.company} <VerifiedIcon sx={{ fontSize: 14 }} />
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.6)' }}>
                <LocationIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="caption">{job.location}</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.6)' }}>
                <PayIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#fff' }}>{job.payRange}</Typography>
             </Box>
          </Stack>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, mb: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', width: '100%', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ px: 1, py: 0.4, borderRadius: '6px', bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(59,130,246,0.2)' }}>
              {job.jobType}
            </Box>
            <Box sx={{ px: 1, py: 0.4, borderRadius: '6px', bgcolor: 'rgba(236,72,153,0.1)', color: '#ec4899', fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(236,72,153,0.2)' }}>
              {job.category}
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Grow>
  );
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    height: 48,
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#facc15', borderWidth: '1px' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' }
  },
};

// ─── Jobs Page Component ─────────────────────────────────────────────────────

export default function Jobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  
  // React Query Fetch
  const { data: jobs = [], isLoading: loading, isError, error } = useAllJobs();
  const deleteJobMutation = useDeleteJob();
  const userId = localStorage.getItem('userId');
  
  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollRef: newJobsRef, scroll: scrollNewJobs } = useHorizontalScroll();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error((error as any)?.response?.data?.message || 'Failed to fetch jobs');
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
      setIsDetailsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  // 1. Sort by CreatedAt (Newest to Oldest)
  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 2. Extract uniquely generated properties for badges/sections
  const newJobs = sortedJobs.filter(j => j.isNew);
  
  const jobCategories = ['All', 'Campus', 'Delivery', 'Marketing', 'Tutoring', 'Tech', 'Food & Bev', 'Other'];
  const jobTypes = ['All', 'Part-Time', 'Internship', 'Freelance', 'Campus', 'Full-Time'];

  // 3. Filter Application
  const filteredJobs = sortedJobs.filter(j => {
    if (activeCategory !== 'All' && j.category !== activeCategory) return false;
    if (activeType !== 'All' && j.jobType !== activeType) return false;
    if (searchQuery.trim() !== '') {
       const q = searchQuery.toLowerCase();
       if (!j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top left, rgba(250,204,21,0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="jobs" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', mt: '-64px', pt: '64px' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, pb: 8, maxWidth: 1400, mx: 'auto', width: '100%' }}>
              
              {/* ── Header Section ─────────────────────────────────────────── */}
              <Fade in={visible} timeout={600}>
                <Box 
                  sx={{ 
                    mb: 8, 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    borderRadius: '32px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                  }}
                >
                  {/* Left Content */}
                  <Box sx={{ p: { xs: 4, md: 6 }, flex: 1, zIndex: 1 }}>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#fff', 
                        fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                        letterSpacing: '-0.03em', 
                        mb: 2 
                      }}
                    >
                      Career Hub
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)', 
                        maxWidth: 600, 
                        mb: 5, 
                        fontWeight: 400, 
                        lineHeight: 1.6,
                        fontSize: '1.1rem'
                      }}
                    >
                      Exclusive campus opportunities curated for your skills. From quick part-time gigs to career-defining internships.
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() => navigate('/jobs/create')}
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: '#facc15',
                        color: '#000',
                        fontWeight: 800,
                        py: 1.5,
                        px: 4,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#eab308',
                        }
                      }}
                    >
                      Post a Job
                    </Button>
                  </Box>

                  {/* Right Image Area */}
                  <Box 
                    sx={{ 
                      width: { xs: '100%', md: '40%' }, 
                      minHeight: { xs: 200, md: 300 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                     <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', bgcolor: 'rgba(250,204,21,0.05)', filter: 'blur(60px)', zIndex: 0, borderRadius: '50%' }} />
                     <Box 
                       component="img" 
                       src="/job_service.png" 
                       alt="Career Hub Illustration" 
                       sx={{
                         maxWidth: '90%',
                         maxHeight: '90%',
                         objectFit: 'contain',
                         position: 'relative',
                         zIndex: 1,
                         opacity: 0.9
                       }} 
                     />
                  </Box>
                </Box>
              </Fade>

              {/* ── New Job Postings (Carousel) ──────────────────────────── */}
              {(loading || newJobs.length > 0) && (
                <Box sx={{ mb: 8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <WorkIcon sx={{ color: '#facc15', fontSize: 28 }} />
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                              New Job Postings
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Recently added opportunities for you</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <IconButton onClick={() => scrollNewJobs('left')} sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(250,204,21,0.15)', borderColor: '#facc15' } }}>
                            <ChevronLeftIcon />
                          </IconButton>
                          <IconButton onClick={() => scrollNewJobs('right')} sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(250,204,21,0.15)', borderColor: '#facc15' } }}>
                            <ChevronRightIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Box 
                        ref={newJobsRef}
                        sx={{ 
                          display: 'flex', 
                          gap: 3, 
                          overflowX: 'auto', 
                          pb: 4, 
                          px: 1, 
                          mx: -1,
                          scrollbarWidth: 'none', 
                          '&::-webkit-scrollbar': { display: 'none' },
                          scrollBehavior: 'smooth',
                          scrollSnapType: 'x mandatory',
                          '& > *': { scrollSnapAlign: 'start' }
                        }}
                      >
                        {loading 
                          ? [1, 2, 3, 4].map((i) => <Box key={i} sx={{ minWidth: { xs: '100%', sm: 340 }, maxWidth: { sm: 380 } }}><JobSkeleton index={i} /></Box>)
                          : newJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} onClick={handleJobClick} />)
                        }
                      </Box>
                    </Box>
              )}

              {/* ── Filter Bar ────────────────────────────────────── */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <SparkleIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                           Opportunities
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                           Sorted by Newest
                        </Typography>
                      </Box>
                  </Box>
                  
                  {/* Filters */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <TextField
                        size="small"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.3)', width: 18 }} /></InputAdornment>,
                            endAdornment: searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'rgba(255,255,255,0.3)', p: 0.2 }}>
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                        sx={{ ...textFieldStyles, minWidth: 220 }}
                      />
                      
                      <TextField
                        select
                        size="small"
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><CategoryIcon sx={{ color: 'rgba(255,255,255,0.3)', width: 18 }} /></InputAdornment>,
                        }}
                        sx={{ ...textFieldStyles, minWidth: 160 }}
                      >
                        {jobCategories.map(cat => <MenuItem key={cat} value={cat}>{cat} Category</MenuItem>)}
                      </TextField>
                      
                      <TextField
                        select
                        size="small"
                        value={activeType}
                        onChange={(e) => setActiveType(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LabelIcon sx={{ color: 'rgba(255,255,255,0.3)', width: 18 }} /></InputAdornment>,
                        }}
                        sx={{ ...textFieldStyles, minWidth: 160 }}
                      >
                        {jobTypes.map(type => <MenuItem key={type} value={type}>{type} Type</MenuItem>)}
                      </TextField>
                  </Box>
                </Box>

                {loading ? (
                  <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                         <JobSkeleton index={i} />
                      </Grid>
                    ))}
                  </Grid>
                ) : filteredJobs.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredJobs.map((job, index) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={job.id}>
                         <JobCard job={job} index={index} onClick={handleJobClick} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>No opportunities found</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your filters to see more results.</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 10, p: 4, borderRadius: '32px', bgcolor: 'rgba(250, 204, 21, 0.03)', border: '1px dashed rgba(250, 204, 21, 0.2)', textAlign: 'center' }}>
                 <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>Don't see what you're looking for?</Typography>
                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>We update our job board daily. Check back tomorrow for more roles!</Typography>
                 <Button variant="outlined" sx={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.4)', borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', '&:hover': { borderColor: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.1)' } }}>
                    Set Job Alerts
                 </Button>
              </Box>

            </Box>
          </Box>
        </PageLayout>
      </Box>

      {/* ── Job Details Dialog ────────────────────────────────────────────── */}
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
          <Box sx={{ position: 'relative' }}>
            {/* Header / Background cover */}
            <Box sx={{ height: { xs: 150, md: 200 }, bgcolor: 'rgba(250, 204, 21, 0.05)', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: `radial-gradient(circle at 20% 50%, #facc15 0%, transparent 50%), radial-gradient(circle at 80% 50%, #facc15 0%, transparent 50%)` }} />
                <IconButton 
                    onClick={handleCloseDetails} 
                    sx={{ 
                        position: 'absolute', 
                        top: 20, 
                        right: 20, 
                        bgcolor: 'rgba(0,0,0,0.5)', 
                        color: '#fff', 
                        backdropFilter: 'blur(10px)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } 
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: { xs: 3, md: 5 }, pt: 0, position: 'relative', mt: -6 }}>
                {/* Company & Title */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 3, mb: 4 }}>
                    <Avatar 
                        src={selectedJob.logo || undefined} 
                        variant="rounded"
                        sx={{ 
                            width: 100, 
                            height: 100, 
                            borderRadius: '24px', 
                            border: '4px solid #0a0a0a', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            bgcolor: '#111'
                        }} 
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                            {selectedJob.title}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#facc15', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {selectedJob.company} <VerifiedIcon sx={{ fontSize: 20 }} />
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <IconButton sx={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '12px' }}>
                            <BookmarkIcon />
                        </IconButton>
                        <IconButton sx={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '12px' }}>
                            <ShareIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* Description */}
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>About the Role</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                                {selectedJob.longDescription}
                            </Typography>
                        </Box>

                        {/* Requirements */}
                        {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                          <Box sx={{ mb: 4 }}>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Requirements</Typography>
                              <Stack spacing={2}>
                                  {selectedJob.requirements.map((req, i) => (
                                      <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                          <Box sx={{ mt: 1, width: 6, height: 6, borderRadius: '50%', bgcolor: '#facc15', flexShrink: 0 }} />
                                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>{req}</Typography>
                                      </Box>
                                  ))}
                              </Stack>
                          </Box>
                        )}

                        {/* Tags */}
                        {selectedJob.tags && selectedJob.tags.length > 0 && (
                          <Box sx={{ mb: 4 }}>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Tags</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {selectedJob.tags.map((tag, i) => (
                                      <Chip key={i} label={tag} variant="outlined" sx={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.3)', bgcolor: 'rgba(250, 204, 21, 0.05)' }} />
                                  ))}
                              </Box>
                          </Box>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {/* Side Details Card */}
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '24px', p: 3, border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 20 }}>
                            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>Job Details</Typography>
                            
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <PayIcon sx={{ color: '#22c55e' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Salary / Pay</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.payRange}</Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <LocationIcon sx={{ color: '#3b82f6' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Location</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.location}</Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <LabelIcon sx={{ color: '#facc15' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Job Type</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.jobType}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <CategoryIcon sx={{ color: '#ec4899' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Category</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.category}</Typography>
                                    </Box>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                            {/* Poster Info */}
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>POSTED BY</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar src={selectedJob.postedBy.avatar || undefined} sx={{ width: 44, height: 44, border: '1px solid #facc15' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{selectedJob.postedBy.name}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{selectedJob.postedBy.email}</Typography>
                                </Box>
                            </Box>

                            {userId === selectedJob.postedBy.userId ? (
                                <Stack spacing={1.5}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        onClick={() => navigate(`/jobs/update/${selectedJob.id}`)}
                                        sx={{ 
                                            bgcolor: '#3b82f6', 
                                            color: '#fff', 
                                            fontWeight: 700, 
                                            borderRadius: '12px', 
                                            py: 1.2,
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: '#2563eb' }
                                        }}
                                    >
                                        Update Listing
                                    </Button>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDeleteJob(selectedJob.id)}
                                        sx={{ 
                                            fontWeight: 700, 
                                            borderRadius: '12px', 
                                            py: 1.2,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Delete Listing
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={1.5}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        startIcon={<EmailIcon />}
                                        sx={{ 
                                            bgcolor: '#facc15', 
                                            color: '#000', 
                                            fontWeight: 700, 
                                            borderRadius: '12px', 
                                            py: 1.2,
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: '#eab308' }
                                        }}
                                        href={`mailto:${selectedJob.postedBy.email}`}
                                    >
                                        Contact Poster
                                    </Button>
                                    {selectedJob.postedBy.mobileNumber && (
                                       <Button 
                                           fullWidth 
                                           variant="outlined" 
                                           startIcon={<PhoneIcon />}
                                           sx={{ 
                                               color: '#facc15', 
                                               borderColor: 'rgba(250, 204, 21, 0.4)',
                                               fontWeight: 700, 
                                               borderRadius: '12px', 
                                               py: 1.2,
                                               textTransform: 'none',
                                               '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)', borderColor: '#facc15' }
                                           }}
                                           href={`tel:${selectedJob.postedBy.mobileNumber}`}
                                       >
                                           Call Poster
                                       </Button>
                                    )}
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
          </Box>
        )}
      </Dialog>

    </Box>
  );
}
