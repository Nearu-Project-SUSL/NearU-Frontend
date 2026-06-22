import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const chartData = [
  { day: 'Mon', revenue: 4200, orders: 8 },
  { day: 'Tue', revenue: 5800, orders: 12 },
  { day: 'Wed', revenue: 7100, orders: 15 },
  { day: 'Thu', revenue: 6400, orders: 11 },
  { day: 'Fri', revenue: 8500, orders: 18 },
  { day: 'Sat', revenue: 9200, orders: 20 },
  { day: 'Sun', revenue: 4500, orders: 10 },
];

export default function BusinessOwnerHome() {
  const { auth } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="business" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 2 }}>
                Welcome, {auth?.user?.username || 'Owner'}!
              </Typography>
              <Typography variant="h6" sx={{ color: '#9ca3af', mb: 4 }}>
                You are logged in as a Business Owner.
              </Typography>
            
              
              <Grid container spacing={3}>
                {[
                  { title: 'Total Sales', count: 'Rs. 45,000', color: '#3b82f6' },
                  { title: 'Active Orders', count: '14', color: '#facc15' },
                  { title: 'Rating', count: '4.8/5.0', color: '#34d399' }
                ].map((stat, i) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={i}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-5px)', borderColor: stat.color }
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>{stat.count}</Typography>
                      <Typography variant="body2" sx={{ color: 'gray' }}>{stat.title}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Sales & Orders Performance Area Chart */}
              <Paper
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: 'inset 0 0 20px rgba(46, 158, 191, 0.05)'
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                  Weekly Sales & Orders Trends
                </Typography>
                
                <Box sx={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E9EBF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2E9EBF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        stroke="#9ca3af" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#9ca3af" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a14', 
                          borderColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }} 
                      />
                      <Area 
                        name="Revenue (Rs.)"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#2E9EBF" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        name="Orders"
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#facc15" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorOrders)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Paper>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}