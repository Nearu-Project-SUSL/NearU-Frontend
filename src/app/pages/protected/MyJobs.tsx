import { useState, useRef } from 'react';
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
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Divider,
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

// ─── Mock Data ───────────────────────────────────────────────────────────────
// In actual app, this would be fetched from API filtered by current user.
type JobType = 'Part-Time' | 'Internship' | 'Freelance' | 'Campus' | 'Full-Time';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  type: JobType | string;
  category: string;
  createdAt: string; 
  postedByUserId: string;
  postedBy: {
    name: string;
    role: string;
    avatar: string;
    email: string;
    phone: string;
  };
  logo: string;
  description: string;
  longDescription: string;
  requirements: string[];
  tags: string[];
  isNew?: boolean;
}

const currentUserMockId = 'user123';

const myJobsData: Job[] = [
  {
    id: 'j4',
    title: 'Social Media Content Creator',
    company: 'Wix Media',
    location: 'Hybrid / Remote',
    pay: 'Rs. 25,000 / month',
    type: 'Internship',
    category: 'Marketing',
    createdAt: '2026-04-02T05:00:00Z',
    isNew: true,
    postedByUserId: 'user123',
    postedBy: {
      name: 'Student Name (You)',
      role: 'Creative Director',
      avatar: 'https://i.pravatar.cc/150?img=5',
      email: 'sarah@wixmedia.lk',
      phone: '+94 71 9876543',
    },
    logo: 'https://ui-avatars.com/api/?name=WM&background=ec4899&color=fff&bold=true',
    description: 'Help manage our Instagram and TikTok accounts. Create engaging content for youth brands.',
    longDescription: 'Wix Media is looking for a creative student intern to help us dominate social media. You will be responsible for filming short-form video content, designing graphics, and engaging with our community.',
    requirements: [
      'Experience with CapCut, Canva, or Adobe Suite',
      'Strong understanding of social media algorithms',
    ],
    tags: ['Creative', 'Hybrid', 'Portfolio'],
  },
  {
    id: 'j2',
    title: 'Customer Support Lead',
    company: 'TechFlow Solutions',
    location: 'Fully Remote',
    pay: 'Rs. 40,000 / month',
    type: 'Part-Time',
    category: 'Tech',
    createdAt: '2026-03-29T10:00:00Z',
    postedByUserId: 'user123',
    postedBy: {
      name: 'Student Name (You)',
      role: 'HR Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'hr@techflow.io',
      phone: '+1 555 0199',
    },
    logo: 'https://ui-avatars.com/api/?name=TF&background=3b82f6&color=fff&bold=true',
    description: 'Provide email and chat support for our software products. Evening and weekend shifts available.',
    longDescription: 'Join our international tech team from the comfort of your hostel. You will be handling customer inquiries via Intercom and email.',
    requirements: [
      'Excellent written English',
      'Stable internet connection',
    ],
    tags: ['Remote', 'USD Equiv', 'Tech Skill'],
  },
];

function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyJobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <PageLayout>
          <Box sx={{ height: 'calc(100vh - 68px)', overflowY: 'auto', overflowX: 'hidden' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 1000, mx: 'auto', width: '100%' }}>
              
              <Fade in={true} timeout={600}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 2 }}>
                    My Posted <span style={{ color: '#facc15' }}>Jobs</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6 }}>
                    Manage the job opportunities you have posted.
                  </Typography>

                  <Grid container spacing={3}>
                    {myJobsData.map((job, index) => (
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
                                    <Avatar src={job.logo} variant="rounded" sx={{ width: 64, height: 64, borderRadius: '16px' }} />
                                    <Box flex={1}>
                                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>{job.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1.5 }}>{job.company}</Typography>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TimeIcon sx={{ fontSize: 14 }} /> Posted on {formatDate(job.createdAt)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LabelIcon sx={{ fontSize: 14 }} /> {job.type}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ p: 4, borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.05)' }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.01)', minWidth: 200 }}>
                                    <Button onClick={() => handleJobClick(job)} variant="outlined" sx={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.4)', mb: 2, borderRadius: '12px' }}>
                                        View Details
                                    </Button>
                                    <Button variant="contained" color="error" sx={{ borderRadius: '12px', fontWeight: 700 }}>
                                        End Listing
                                    </Button>
                                </Box>
                            </Card>
                        </Grow>
                      </Grid>
                    ))}
                  </Grid>

                  {myJobsData.length === 0 && (
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
        </PageLayout>
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
