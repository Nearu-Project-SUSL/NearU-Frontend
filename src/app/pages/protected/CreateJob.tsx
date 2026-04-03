import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { toast } from 'sonner';

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Fade,
  InputAdornment,
} from '@mui/material';

import {
  WorkOutline as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as PayIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

const jobTypes = ['Part-Time', 'Internship', 'Freelance', 'Campus', 'Full-Time'];
const jobCategories = ['Campus', 'Delivery', 'Marketing', 'Tutoring', 'Tech', 'Food & Bev', 'Other'];

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(250, 204, 21, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#facc15',
      borderWidth: '2px',
    },
    '& .MuiSelect-icon': {
        color: 'rgba(255,255,255,0.5)',
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.4)',
    '&.Mui-focused': {
      color: '#facc15',
    },
  },
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    pay: '',
    type: '',
    category: '',
    description: '',
    longDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In actual implementation, send formData and auth token to backend here.
    toast.success('Job posted successfully! (Mock)');
    navigate('/jobs');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', backgroundImage: 'radial-gradient(circle at top left, rgba(250,204,21,0.03) 0%, transparent 50%)' }}>
      <Sidebar activeSection="jobs" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{ height: 'calc(100vh - 68px)', overflowY: 'auto', overflowX: 'hidden' }}>
            <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
              
              <Fade in={true} timeout={600}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 2 }}>
                    Post a <span style={{ color: '#facc15' }}>Job</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6 }}>
                    Create a new job listing for NearU students. Fill out the details below.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    
                    <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>Basic Information</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Job Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Company / Organization"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><CompanyIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><LocationIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Pay / Salary"
                            name="pay"
                            placeholder="e.g. Rs. 400 / hr"
                            value={formData.pay}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><PayIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            required
                            label="Job Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><LabelIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          >
                            {jobTypes.map((option) => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            required
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><CategoryIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          >
                            {jobCategories.map((option) => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>Job Details</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            multiline
                            rows={2}
                            label="Short Summary"
                            name="description"
                            placeholder="A brief 1-2 sentence description for the job card..."
                            value={formData.description}
                            onChange={handleChange}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            multiline
                            rows={6}
                            label="Long Description"
                            name="longDescription"
                            placeholder="Provide full details about the role, requirements, and responsibilities..."
                            value={formData.longDescription}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescriptionIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: '#facc15',
                        color: '#000',
                        fontWeight: 800,
                        py: 2,
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#eab308',
                        }
                      }}
                    >
                      Post Your Job
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => navigate('/jobs')}
                      sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', mt: -2 }}
                    >
                      Cancel & Return to Jobs
                    </Button>
                  </Box>
                  
                </Box>
              </Fade>

            </Box>
          </Box>
        </PageLayout>
      </Box>
    </Box>
  );
}
