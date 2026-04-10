import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { toast } from 'sonner';
import jobService from '../../../api/jobService';
import { useUpdateJob } from '../../hooks/useJobs';

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Fade,
  InputAdornment,
  Stack,
} from '@mui/material';

import {
  WorkOutline as WorkIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  AttachMoney as PayIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  Image as ImageIcon,
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

export default function UpdateJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    payRange: '',
    jobType: '',
    category: '',
    description: '',
    longDescription: '',
    tags: '',
    requirements: '',
  });

  useEffect(() => {
    if (id) {
       jobService.getJobById(id).then(job => {
          setFormData({
             title: job.title,
             company: job.company,
             location: job.location,
             payRange: job.payRange,
             jobType: job.jobType,
             category: job.category,
             description: job.description,
             longDescription: job.longDescription || '',
             tags: job.tags ? job.tags.join(', ') : '',
             requirements: job.requirements ? job.requirements.join('\n') : '',
          });
          if (job.logo) {
            setLogoUrl(job.logo);
            setLogoPreview(job.logo);
            setLogoInputMode('url');
          }
          setIsLoading(false);
       }).catch(err => {
          toast.error("Failed to load job details");
          navigate('/my-jobs');
       });
    }
  }, [id, navigate]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoInputMode, setLogoInputMode] = useState<'file' | 'url'>('file');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      
      // Upload to ImageKit immediately
      try {
        setIsUploadingLogo(true);
        const uploadedUrl = await jobService.uploadLogo(file);
        setLogoUrl(uploadedUrl);
        toast.success('Logo uploaded successfully!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to upload logo');
        setLogoFile(null);
        setLogoPreview(null);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLogoUrl(url);
    setLogoPreview(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateJobMutation = useUpdateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        requirements: formData.requirements ? formData.requirements.split('\n').map(r => r.trim()).filter(Boolean) : [],
        logo: logoUrl || undefined,
      };
      
      await updateJobMutation.mutateAsync({ id, data: jobData });
      toast.success('Job updated successfully!');
      navigate('/my-jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
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
                    Update <span style={{ color: '#facc15' }}>Job</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6 }}>
                    Edit the details of your job listing below.
                  </Typography>

                  {isLoading ? (
                    <Typography sx={{ color: 'white' }}>Loading job details...</Typography>
                  ) : (

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
                            name="payRange"
                            placeholder="e.g. Rs. 400 / hr"
                            value={formData.payRange}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><PayIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Box sx={{ 
                            border: '1px dashed rgba(255,255,255,0.2)', 
                            borderRadius: '12px', 
                            p: 3, 
                            bgcolor: 'rgba(255,255,255,0.02)',
                          }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, textAlign: 'center' }}>
                              Company Logo (Optional)
                            </Typography>
                            
                            {/* Toggle between file upload and URL */}
                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                              <Button 
                                size="small" 
                                variant={logoInputMode === 'file' ? 'contained' : 'outlined'}
                                onClick={() => setLogoInputMode('file')}
                                sx={{ 
                                  bgcolor: logoInputMode === 'file' ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                                  color: '#fff', 
                                  borderColor: 'rgba(255,255,255,0.2)',
                                  textTransform: 'none',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Upload File (ImageKit)
                              </Button>
                              <Button 
                                size="small" 
                                variant={logoInputMode === 'url' ? 'contained' : 'outlined'}
                                onClick={() => setLogoInputMode('url')}
                                sx={{ 
                                  bgcolor: logoInputMode === 'url' ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                                  color: '#fff', 
                                  borderColor: 'rgba(255,255,255,0.2)',
                                  textTransform: 'none',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Image URL
                              </Button>
                            </Stack>

                            {logoInputMode === 'file' ? (
                              <Box sx={{ 
                                border: '1px dashed rgba(255,255,255,0.2)', 
                                borderRadius: '12px', 
                                p: 2, 
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                '&:hover': { borderColor: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.05)' }
                              }}>
                                {logoPreview && logoInputMode === 'file' ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Box component="img" src={logoPreview} alt="Logo preview" sx={{ height: 64, width: 64, borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    {isUploadingLogo && <Typography variant="caption" sx={{ color: '#facc15' }}>Uploading to ImageKit...</Typography>}
                                    {!isUploadingLogo && logoUrl && <Typography variant="caption" sx={{ color: '#22c55e' }}>✓ Uploaded to ImageKit</Typography>}
                                    <Button variant="outlined" component="label" size="small" disabled={isUploadingLogo} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', fontSize: '0.75rem', '&:hover': { borderColor: '#facc15', color: '#facc15' } }}>
                                      Change Image
                                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <ImageIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 32 }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Max 5MB • PNG, JPG, WebP</Typography>
                                    <Typography variant="caption" sx={{ color: '#facc15' }}>Powered by ImageKit Cloud</Typography>
                                    <Button variant="contained" component="label" size="small" disabled={isUploadingLogo} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', textTransform: 'none', boxShadow: 'none', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', boxShadow: 'none' } }}>
                                      {isUploadingLogo ? 'Uploading...' : 'Select Image'}
                                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                label="Logo URL"
                                placeholder="https://example.com/logo.png"
                                value={logoUrl}
                                onChange={handleLogoUrlChange}
                                sx={textFieldStyles}
                              />
                            )}

                            {/* Preview for URL mode */}
                            {logoInputMode === 'url' && logoPreview && (
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Box component="img" src={logoPreview} alt="Logo preview" sx={{ height: 64, width: 64, borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            required
                            label="Job Type"
                            name="jobType"
                            value={formData.jobType}
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
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Tags (comma separated)"
                            name="tags"
                            placeholder="e.g. Remote, Urgent, Design"
                            value={formData.tags}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><LabelIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                            }}
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Requirements (one per line)"
                            name="requirements"
                            placeholder="e.g.&#10;Must be currently enrolled in 3rd year&#10;Excellent communication skills&#10;Access to reliable internet"
                            value={formData.requirements}
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
                      disabled={isSubmitting}
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
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(250, 204, 21, 0.3)',
                          color: 'rgba(0,0,0,0.4)'
                        }
                      }}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Your Job'}
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => navigate('/my-jobs')}
                      sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', mt: -2 }}
                    >
                      Cancel & Return to My Jobs
                    </Button>
                  </Box>
                 )}
                </Box>
              </Fade>

            </Box>
          </Box>
        </PageLayout>
      </Box>
    </Box>
  );
}
