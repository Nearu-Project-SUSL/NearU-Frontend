import { useState, useEffect, useRef } from 'react';
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
  DialogTitle,
  DialogContent,
  Grid,
  Stack,
  Divider,
} from '@mui/material';

import {
  LocationOn as LocationIcon,
  Business as CompanyIcon,
  AttachMoney as PayIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  WorkOutline as WorkIcon,
  Person as UserIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as SparkleIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
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

const jobsData: Job[] = [
  {
    id: 'j1',
    title: 'Library Assistant',
    company: 'Sabaragamuwa University',
    location: 'Main Campus Library',
    pay: 'Rs. 400 / hr',
    type: 'Campus',
    category: 'Campus',
    postedAt: '2 hours ago',
    isNew: true,
    postedBy: {
      name: 'Dr. Priyantha Silva',
      role: 'Chief Librarian',
      avatar: 'https://i.pravatar.cc/150?img=11',
      email: 'library@sab.ac.lk',
      phone: '+94 45 2280011',
    },
    logo: 'https://ui-avatars.com/api/?name=SU&background=facc15&color=000&bold=true',
    description: 'Assist with organizing books, managing student checkouts, and maintaining a quiet study environment.',
    longDescription: 'We are looking for a dedicated student to assist our library staff during peak hours. The role involves checking books in and out, shelving returned items, and helping students locate resources. This is an excellent opportunity for those who enjoy a quiet work environment and want to stay close to their studies.',
    requirements: [
      'Currently enrolled student at Sabaragamuwa University',
      'Basic computer literacy',
      'Good organizational skills',
      'Ability to work at least 10 hours per week'
    ],
    tags: ['Student Friendly', 'Flexible', 'On Campus'],
  },
  {
    id: 'j6',
    title: 'Delivery Partner',
    company: 'NearU Food',
    location: 'Belihuloya & Pambahinna',
    pay: 'Rs. 200 / delivery',
    type: 'Freelance',
    category: 'Delivery',
    postedAt: '5 hours ago',
    isNew: true,
    postedBy: {
      name: 'Admin Team',
      role: 'Operations Manager',
      avatar: 'https://i.pravatar.cc/150?img=12',
      email: 'careers@nearu.lk',
      phone: '+94 77 1234567',
    },
    logo: 'https://ui-avatars.com/api/?name=NU&background=ef4444&color=fff&bold=true',
    description: 'Own a bike? Earn extra cash delivering food to fellow students during your free time.',
    longDescription: 'Join the NearU delivery fleet and become a vital part of our campus ecosystem. You can set your own hours and earn per delivery. Perfect for students with their own transport who want to make quick cash between lectures or in the evenings.',
    requirements: [
      'Valid driving license and a registered motorbike',
      'Smart phone with active data connection',
      'Punctuality and good communication skills',
      'Familiarity with the campus layout'
    ],
    tags: ['Be Your Own Boss', 'Immediate Start', 'High Tips'],
  },
  {
    id: 'j4',
    title: 'Social Media Content Creator',
    company: 'Wix Media',
    location: 'Hybrid / Remote',
    pay: 'Rs. 25,000 / month',
    type: 'Internship',
    category: 'Marketing',
    postedAt: '8 hours ago',
    isNew: true,
    postedBy: {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://i.pravatar.cc/150?img=5',
      email: 'sarah@wixmedia.lk',
      phone: '+94 71 9876543',
    },
    logo: 'https://ui-avatars.com/api/?name=WM&background=ec4899&color=fff&bold=true',
    description: 'Help manage our Instagram and TikTok accounts. Create engaging content for youth brands.',
    longDescription: 'Wix Media is looking for a creative student intern to help us dominate social media. You will be responsible for filming short-form video content, designing graphics, and engaging with our community. If you are always on TikTok and know the latest trends, this is for you!',
    requirements: [
      'Experience with CapCut, Canva, or Adobe Suite',
      'Strong understanding of social media algorithms',
      'Creative mindset and storytelling ability',
      'Must provide a portfolio or link to social profiles'
    ],
    tags: ['Creative', 'Hybrid', 'Portfolio'],
  },
  {
    id: 'j3',
    title: 'Math Tutor (A/L Combined)',
    company: 'EduCare Academy',
    location: 'Belihuloya Town',
    pay: 'Rs. 1,200 / hr',
    type: 'Freelance',
    category: 'Tutoring',
    postedAt: '2 days ago',
    postedBy: {
      name: 'Mr. Bandara',
      role: 'Academy Principal',
      avatar: 'https://i.pravatar.cc/150?img=8',
      email: 'educare.town@gmail.com',
      phone: '+94 45 5566778',
    },
    logo: 'https://ui-avatars.com/api/?name=EC&background=10b981&color=fff&bold=true',
    description: 'Looking for an undergrad excellent in Combined Maths to tutor local A/L students.',
    longDescription: 'Help the local community by sharing your knowledge. We need a bright undergraduate to conduct evening classes for Advanced Level students. You will be provided with all necessary teaching materials and a comfortable classroom environment.',
    requirements: [
      'A/A+ in Combined Maths at G.C.E A/L',
      'Clear communication and patience',
      'Available on Saturday mornings or weekday evenings',
      'Previous teaching experience is a plus'
    ],
    tags: ['High Pay', 'Weekend', 'Education'],
  },
  {
    id: 'j2',
    title: 'Customer Support Lead',
    company: 'TechFlow Solutions',
    location: 'Fully Remote',
    pay: 'Rs. 40,000 / month',
    type: 'Part-Time',
    category: 'Tech',
    postedAt: '3 days ago',
    postedBy: {
      name: 'Michael Chen',
      role: 'HR Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'hr@techflow.io',
      phone: '+1 555 0199',
    },
    logo: 'https://ui-avatars.com/api/?name=TF&background=3b82f6&color=fff&bold=true',
    description: 'Provide email and chat support for our software products. Evening and weekend shifts available.',
    longDescription: 'Join our international tech team from the comfort of your hostel. You will be handling customer inquiries via Intercom and email, helping users troubleshoot our SaaS platform. We provide full training and a supportive remote environment.',
    requirements: [
      'Excellent written English',
      'Stable internet connection',
      'Problem-solving mindset',
      'Ability to work independently'
    ],
    tags: ['Remote', 'USD Equiv', 'Tech Skill'],
  },
  {
    id: 'j5',
    title: 'Evening Barista',
    company: 'Bean & Brew Cafe',
    location: 'Near University Main Gate',
    pay: 'Rs. 350 / hr + Meals',
    type: 'Part-Time',
    category: 'Food & Bev',
    postedAt: '4 days ago',
    postedBy: {
      name: 'Amila Perera',
      role: 'Cafe Owner',
      avatar: 'https://i.pravatar.cc/150?img=15',
      email: 'beanbrew.belihuloya@gmail.com',
      phone: '+94 76 5544332',
    },
    logo: 'https://ui-avatars.com/api/?name=BB&background=8b5cf6&color=fff&bold=true',
    description: 'Looking for energetic staff for the evening shift (4 PM - 9 PM). Coffee training will be provided.',
    longDescription: 'Bean & Brew is the favorite hangout spot for Sabra students. We need a friendly face to join our evening team. You\'ll learn to make great coffee, handle the POS system, and ensure our customers have a great experience. We offer free meals during shifts!',
    requirements: [
      'Friendly and outgoing personality',
      'Ability to work in a fast-paced environment',
      'Punctuality is critical',
      'No prior experience required (we train!)'
    ],
    tags: ['Evening Shift', 'Free Meals', 'Social'],
  },
];

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
function JobCard({ job, index, onClick }: { job: Job, index: number, onClick: (job: Job) => void }) {
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
          sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
        >
          {/* Top: Logo & Badges */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2.5 }}>
            <Avatar 
                src={job.logo} 
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
                    <TimeIcon sx={{ fontSize: 12 }} /> {job.postedAt}
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
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#fff' }}>{job.pay}</Typography>
             </Box>
          </Stack>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, mb: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
            {job.tags.slice(0, 3).map(tag => (
              <Box key={tag} sx={{ px: 1, py: 0.4, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.05)' }}>
                {tag}
              </Box>
            ))}
          </Box>
        </CardActionArea>
      </Card>
    </Grow>
  );
}

// ─── Jobs Page Component ─────────────────────────────────────────────────────

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const { scrollRef: newJobsRef, scroll: scrollNewJobs } = useHorizontalScroll();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const newJobs = jobsData.filter(j => j.isNew);
  const allJobs = jobsData; // Including new jobs for the "All" section as common practice

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top left, rgba(250,204,21,0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="jobs" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{ height: 'calc(100vh - 68px)', overflowY: 'auto', overflowX: 'hidden' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
              
              {/* ── Header Section ─────────────────────────────────────────── */}
              <Fade in={visible} timeout={600}>
                <Box sx={{ mb: 8, textAlign: 'center', position: 'relative' }}>
                  <Box 
                    sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        bgcolor: 'rgba(250, 204, 21, 0.1)', 
                        color: '#facc15', 
                        px: 2, 
                        py: 0.8, 
                        borderRadius: '20px',
                        mb: 3,
                        border: '1px solid rgba(250, 204, 21, 0.2)'
                    }}
                  >
                    <SparkleIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.1em' }}>OPPORTUNITIES AWAIT</Typography>
                  </Box>
                  
                  <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2.5rem', md: '3.8rem' }, letterSpacing: '-0.03em', mb: 2 }}>
                    Career <Box component="span" sx={{ color: '#facc15' }}>Hub</Box>
                  </Typography>
                  
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 700, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                    Unlock your potential with part-time roles designed specifically for Sabra students. 
                    Gain experience, earn money, and build your future.
                  </Typography>
                  
                  {/* Decorative background glow */}
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40%', height: '100%', bgcolor: 'rgba(250,204,21,0.05)', filter: 'blur(80px)', zIndex: -1, borderRadius: '50%' }} />
                </Box>
              </Fade>

              {/* ── New Job Postings (Carousel) ──────────────────────────── */}
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
                  {newJobs.map((job, i) => (
                    <JobCard key={job.id} job={job} index={i} onClick={handleJobClick} />
                  ))}
                </Box>
              </Box>

              {/* ── All Opportunities ────────────────────────────────────── */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <SparkleIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                      All Opportunities
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Browse our complete list of verified roles</Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {allJobs.map((job, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={job.id}>
                       <JobCard job={job} index={index + 3} onClick={handleJobClick} />
                    </Grid>
                  ))}
                </Grid>
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
                        src={selectedJob.logo} 
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
                    <Grid item xs={12} md={8}>
                        {/* Description */}
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>About the Role</Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                                {selectedJob.longDescription}
                            </Typography>
                        </Box>

                        {/* Requirements */}
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
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* Side Details Card */}
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '24px', p: 3, border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 20 }}>
                            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>Job Details</Typography>
                            
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <PayIcon sx={{ color: '#22c55e' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Salary / Pay</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.pay}</Typography>
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
                                    <TimeIcon sx={{ color: '#facc15' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Job Type</Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedJob.type}</Typography>
                                    </Box>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                            {/* Poster Info */}
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>POSTED BY</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar src={selectedJob.postedBy.avatar} sx={{ width: 44, height: 44, border: '1px solid #facc15' }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{selectedJob.postedBy.name}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{selectedJob.postedBy.role}</Typography>
                                </Box>
                            </Box>

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
                                    Email Recruiter
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    startIcon={<PhoneIcon />}
                                    sx={{ 
                                        color: '#fff', 
                                        borderColor: 'rgba(255,255,255,0.1)', 
                                        fontWeight: 600, 
                                        borderRadius: '12px', 
                                        py: 1.2,
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.05)' }
                                    }}
                                    href={`tel:${selectedJob.postedBy.phone}`}
                                >
                                    Call Now
                                </Button>
                            </Stack>
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
