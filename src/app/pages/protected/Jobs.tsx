import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

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
  InputBase,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';

import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as CompanyIcon,
  AttachMoney as PayIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  WorkOutline as WorkIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// ─── Mock Data ───────────────────────────────────────────────────────────────

type JobType = 'Part-Time' | 'Internship' | 'Freelance' | 'Campus';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  type: JobType;
  category: string;
  postedAt: string;
  logo: string;
  description: string;
  tags: string[];
}

const jobsData: Job[] = [
  {
    id: 'j1',
    title: 'Library Assistant',
    company: 'Sabaragamuwa University',
    location: 'Campus Library',
    pay: 'Rs. 400 / hr',
    type: 'Campus',
    category: 'Campus',
    postedAt: '2 days ago',
    logo: 'https://ui-avatars.com/api/?name=SU&background=facc15&color=000&bold=true',
    description: 'Assist with organizing books, managing student checkouts, and maintaining a quiet study environment. Perfect for students looking to work between classes.',
    tags: ['Student Friendly', 'Flexible Hours', 'On Campus'],
  },
  {
    id: 'j2',
    title: 'Customer Support Representative',
    company: 'TechFlow Solutions',
    location: 'Remote',
    pay: 'Rs. 35,000 / month',
    type: 'Part-Time',
    category: 'Tech',
    postedAt: '1 week ago',
    logo: 'https://ui-avatars.com/api/?name=TF&background=3b82f6&color=fff&bold=true',
    description: 'Provide email and chat support for our software products. Evening and weekend shifts available.',
    tags: ['Remote', 'Weekend Shifts'],
  },
  {
    id: 'j3',
    title: 'Math Tutor (A/L)',
    company: 'EduCare Academy',
    location: 'Belihuloya Town',
    pay: 'Rs. 1,000 / hr',
    type: 'Freelance',
    category: 'Tutoring',
    postedAt: '3 days ago',
    logo: 'https://ui-avatars.com/api/?name=EC&background=10b981&color=fff&bold=true',
    description: 'Looking for an undergrad excellent in Combined Maths to tutor local A/L students. 4-6 hours per week.',
    tags: ['High Pay', 'Weekend'],
  },
  {
    id: 'j4',
    title: 'Social Media Intern',
    company: 'Wix Media',
    location: 'Hybrid',
    pay: 'Rs. 25,000 / month',
    type: 'Internship',
    category: 'Marketing',
    postedAt: '5 hours ago',
    logo: 'https://ui-avatars.com/api/?name=WM&background=ec4899&color=fff&bold=true',
    description: 'Help manage our Instagram and TikTok accounts. Create engaging content for youth brands.',
    tags: ['Creative', 'Hybrid'],
  },
  {
    id: 'j5',
    title: 'Barista / Cashier',
    company: 'Bean & Brew Cafe',
    location: 'Near University Gate',
    pay: 'Rs. 350 / hr',
    type: 'Part-Time',
    category: 'Food & Bev',
    postedAt: '1 day ago',
    logo: 'https://ui-avatars.com/api/?name=BB&background=8b5cf6&color=fff&bold=true',
    description: 'Looking for energetic staff for the evening shift (4 PM - 9 PM). Coffee training will be provided.',
    tags: ['Evening Shift', 'No Exp Needed'],
  },
  {
    id: 'j6',
    title: 'Delivery Rider',
    company: 'NearU Food',
    location: 'Campus & Surrounding',
    pay: 'Per Delivery + Tips',
    type: 'Freelance',
    category: 'Delivery',
    postedAt: 'Just now',
    logo: 'https://ui-avatars.com/api/?name=NU&background=ef4444&color=fff&bold=true',
    description: 'Own a bike? Earn extra cash delivering food to fellow students during your free time. Set your own hours.',
    tags: ['Be Your Own Boss', 'Immediate Start'],
  },
];

const categories = ['All', 'Campus', 'Tech', 'Tutoring', 'Food & Bev', 'Delivery', 'Marketing'];

// ─── Jobs Page Component ─────────────────────────────────────────────────────

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Application Dialog State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyComplete, setApplyComplete] = useState(false);

  // Filtering
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || job.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
    setApplyComplete(false);
  };

  const handleCloseApply = () => {
    setIsApplyOpen(false);
    setTimeout(() => setSelectedJob(null), 300); // clear after transition
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyComplete(true);
    setTimeout(() => {
      handleCloseApply();
    }, 2000);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top left, rgba(250,204,21,0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="jobs" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{ height: 'calc(100vh - 68px)', overflowY: 'auto', overflowX: 'hidden' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
              
              {/* ── Hero / Header ─────────────────────────────────────────── */}
              <Fade in timeout={600}>
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-0.02em', mb: 1.5 }}>
                    Find Your Next <br />
                    <Box component="span" sx={{ color: '#facc15' }}>Part-time Job</Box>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Browse opportunities tailored for students. Flexible hours, great pay, and valuable experience to build your resume.
                  </Typography>
                </Box>
              </Fade>

              {/* ── Search & Filters ──────────────────────────────────────── */}
              <Fade in timeout={800}>
                <Box sx={{ mb: 6 }}>
                  {/* Search Bar */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      bgcolor: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      p: 1,
                      mb: 3,
                      maxWidth: 600,
                      transition: 'border 0.3s ease',
                      '&:focus-within': { borderColor: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.02)' }
                    }}
                  >
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', ml: 1, mr: 1.5 }} />
                    <InputBase
                      placeholder="Search jobs or companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{ color: '#fff', flex: 1, fontSize: '1rem', '& input::placeholder': { color: 'rgba(255,255,255,0.3)', opacity: 1 } }}
                    />
                  </Box>

                  {/* Category Chips */}
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {categories.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <Chip
                          key={cat}
                          label={cat}
                          onClick={() => setActiveCategory(cat)}
                          sx={{
                            bgcolor: isActive ? '#facc15' : 'rgba(255,255,255,0.05)',
                            color: isActive ? '#000' : 'rgba(255,255,255,0.7)',
                            fontWeight: isActive ? 700 : 500,
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: isActive ? '#facc15' : 'transparent',
                            px: 1,
                            py: 2,
                            fontSize: '0.9rem',
                            '&:hover': {
                              bgcolor: isActive ? '#eab308' : 'rgba(255,255,255,0.1)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Fade>

              {/* ── Job Listings Grid ─────────────────────────────────────── */}
              {filteredJobs.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredJobs.map((job, index) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={job.id}>
                      <Grow in timeout={500 + index * 100}>
                        <Card
                          elevation={0}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'rgba(255,255,255,0.02)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            p: 3,
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            '&:hover': {
                              transform: 'translateY(-6px)',
                              borderColor: 'rgba(250, 204, 21, 0.3)',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                              bgcolor: 'rgba(250,204,21,0.02)',
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar src={job.logo} sx={{ width: 56, height: 56, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2, mb: 0.5 }}>
                                {job.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
                                <CompanyIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{job.company}</Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255,255,255,0.7)' }}>
                              <LocationIcon sx={{ fontSize: 16, color: '#facc15' }} />
                              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{job.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255,255,255,0.7)' }}>
                              <PayIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                              <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{job.pay}</Typography>
                            </Box>
                          </Box>

                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, lineHeight: 1.6, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {job.description}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {job.tags.map(tag => (
                              <Box key={tag} sx={{ px: 1.2, py: 0.5, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 500 }}>
                                {tag}
                              </Box>
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                              <TimeIcon sx={{ fontSize: 14 }} />
                              {job.postedAt}
                            </Box>
                            <Button 
                              variant="contained" 
                              onClick={() => handleApplyClick(job)}
                              sx={{
                                bgcolor: '#facc15',
                                color: '#000',
                                fontWeight: 700,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 3,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#eab308', boxShadow: '0 4px 12px rgba(250,204,21,0.3)' }
                              }}
                            >
                              Apply Now
                            </Button>
                          </Box>

                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* Empty State */
                <Fade in>
                  <Box sx={{ textAlign: 'center', py: 10, px: 2 }}>
                    <Box sx={{ width: 80, height: 80, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                      <WorkIcon sx={{ fontSize: 40, color: '#facc15', opacity: 0.8 }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                      No jobs found
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 400, mx: 'auto' }}>
                      We couldn't find any jobs matching your search "{searchQuery}" in the "{activeCategory}" category.
                    </Typography>
                    <Button 
                      onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                      sx={{ mt: 3, color: '#facc15', textTransform: 'none', fontWeight: 600 }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Fade>
              )}

            </Box>
          </Box>
        </PageLayout>
      </Box>

      {/* ── Application Dialog ────────────────────────────────────────────── */}
      <Dialog 
        open={isApplyOpen} 
        onClose={handleCloseApply}
        PaperProps={{
          sx: {
            bgcolor: '#111',
            borderRadius: '24px',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            maxWidth: 500,
            width: '100%',
            backgroundImage: 'none',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }
        }}
      >
        {!applyComplete ? (
          <form onSubmit={handleSubmitApplication}>
            <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                Apply for {selectedJob?.title}
              </Typography>
              <IconButton onClick={handleCloseApply} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3, pt: 0 }}>
              <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(250,204,21,0.05)', borderRadius: '12px', border: '1px dashed rgba(250, 204, 21, 0.2)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Applying to:</Typography>
                <Typography variant="body1" sx={{ color: '#facc15', fontWeight: 600 }}>{selectedJob?.company}</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField 
                  fullWidth 
                  required
                  label="Full Name" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#facc15' } },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#facc15' } }
                  }}
                />
                <TextField 
                  fullWidth 
                  required
                  type="email"
                  label="Email Address" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#facc15' } },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#facc15' } }
                  }}
                />
                <TextField 
                  fullWidth 
                  required
                  label="Mobile Number" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#facc15' } },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#facc15' } }
                  }}
                />
                <TextField 
                  fullWidth 
                  multiline
                  rows={4}
                  label="Why are you a good fit? (Optional)" 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#facc15' } },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#facc15' } }
                  }}
                />
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button 
                onClick={handleCloseApply} 
                sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontWeight: 600, px: 3 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                sx={{ bgcolor: '#facc15', color: '#000', fontWeight: 700, borderRadius: '10px', px: 4, textTransform: 'none', '&:hover': { bgcolor: '#eab308' } }}
              >
                Submit Application
              </Button>
            </DialogActions>
          </form>
        ) : (
          /* Success State */
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Grow in timeout={400}>
              <CheckCircleIcon sx={{ fontSize: 80, color: '#22c55e', mb: 2 }} />
            </Grow>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
              Application Sent!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
              Your application for {selectedJob?.title} has been submitted successfully to {selectedJob?.company}.
            </Typography>
          </Box>
        )}
      </Dialog>

    </Box>
  );
}
