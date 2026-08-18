import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  DirectionsBus as BusIcon,
  Train as TrainIcon,
  LocalTaxi as TukIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useNearUTheme } from '../../context/ThemeContext';
import { transportService } from '../../../api/transportService';
import type {
  BusRoute,
  BusRouteUpdateDto,
  TrainRoute,
  TrainRouteUpdateDto,
  TukTukDriver,
  TukTukDriverUpdateDto,
} from '../../../types/transport';

type TransportTab = 'bus' | 'train' | 'tuk';

export default function AdminTransportManager() {
  const { isDark } = useNearUTheme();
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  const [activeTab, setActiveTab] = useState<TransportTab>('bus');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [buses, setBuses] = useState<BusRoute[]>([]);
  const [trains, setTrains] = useState<TrainRoute[]>([]);
  const [tuks, setTuks] = useState<TukTukDriver[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [busDialogOpen, setBusDialogOpen] = useState(false);
  const [trainDialogOpen, setTrainDialogOpen] = useState(false);
  const [tukDialogOpen, setTukDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Item being edited or deleted
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: number; type: TransportTab; title: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [busForm, setBusForm] = useState<BusRouteUpdateDto>({
    routeName: '',
    startPoint: '',
    endPoint: '',
    departureTime: '',
    arrivalTime: '',
    busNumber: '',
    notes: '',
  });

  const [trainForm, setTrainForm] = useState<TrainRouteUpdateDto>({
    routeName: '',
    startStation: '',
    endStation: '',
    departureTime: '',
    arrivalTime: '',
    trainName: '',
    notes: '',
  });

  const [tukForm, setTukForm] = useState<TukTukDriverUpdateDto>({
    name: '',
    phoneNumber: '',
    plateNumber: '',
    operatingArea: '',
    notes: '',
  });

  // Fetch all transport data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [busData, trainData, tukData] = await Promise.all([
        transportService.getBusRoutes(),
        transportService.getTrainRoutes(),
        transportService.getTukTukDrivers(),
      ]);
      setBuses(busData || []);
      setTrains(trainData || []);
      setTuks(tukData || []);
    } catch (err: any) {
      console.error('Error fetching admin transport data:', err);
      toast.error('Failed to load transport schedules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Filtered Data ─────────────────────────────────────────────────────────
  const filteredBuses = useMemo(() => {
    if (!searchTerm.trim()) return buses;
    const q = searchTerm.toLowerCase();
    return buses.filter(
      (b) =>
        b.routeName?.toLowerCase().includes(q) ||
        b.startPoint?.toLowerCase().includes(q) ||
        b.endPoint?.toLowerCase().includes(q) ||
        b.busNumber?.toLowerCase().includes(q)
    );
  }, [buses, searchTerm]);

  const filteredTrains = useMemo(() => {
    if (!searchTerm.trim()) return trains;
    const q = searchTerm.toLowerCase();
    return trains.filter(
      (t) =>
        t.routeName?.toLowerCase().includes(q) ||
        t.startStation?.toLowerCase().includes(q) ||
        t.endStation?.toLowerCase().includes(q) ||
        t.trainName?.toLowerCase().includes(q)
    );
  }, [trains, searchTerm]);

  const filteredTuks = useMemo(() => {
    if (!searchTerm.trim()) return tuks;
    const q = searchTerm.toLowerCase();
    return tuks.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.plateNumber?.toLowerCase().includes(q) ||
        t.phoneNumber?.toLowerCase().includes(q) ||
        t.operatingArea?.toLowerCase().includes(q)
    );
  }, [tuks, searchTerm]);

  // ─── Modal Handlers ────────────────────────────────────────────────────────
  const handleOpenAddBus = () => {
    setEditingItem(null);
    setBusForm({
      routeName: '',
      startPoint: '',
      endPoint: '',
      departureTime: '',
      arrivalTime: '',
      busNumber: '',
      notes: '',
    });
    setBusDialogOpen(true);
  };

  const handleOpenEditBus = (bus: BusRoute) => {
    setEditingItem(bus);
    setBusForm({
      routeName: bus.routeName || '',
      startPoint: bus.startPoint || '',
      endPoint: bus.endPoint || '',
      departureTime: bus.departureTime || '',
      arrivalTime: bus.arrivalTime || '',
      busNumber: bus.busNumber || '',
      notes: bus.notes || '',
    });
    setBusDialogOpen(true);
  };

  const handleOpenAddTrain = () => {
    setEditingItem(null);
    setTrainForm({
      routeName: '',
      startStation: '',
      endStation: '',
      departureTime: '',
      arrivalTime: '',
      trainName: '',
      notes: '',
    });
    setTrainDialogOpen(true);
  };

  const handleOpenEditTrain = (train: TrainRoute) => {
    setEditingItem(train);
    setTrainForm({
      routeName: train.routeName || '',
      startStation: train.startStation || '',
      endStation: train.endStation || '',
      departureTime: train.departureTime || '',
      arrivalTime: train.arrivalTime || '',
      trainName: train.trainName || '',
      notes: train.notes || '',
    });
    setTrainDialogOpen(true);
  };

  const handleOpenAddTuk = () => {
    setEditingItem(null);
    setTukForm({
      name: '',
      phoneNumber: '',
      plateNumber: '',
      operatingArea: '',
      notes: '',
    });
    setTukDialogOpen(true);
  };

  const handleOpenEditTuk = (tuk: TukTukDriver) => {
    setEditingItem(tuk);
    setTukForm({
      name: tuk.name || '',
      phoneNumber: tuk.phoneNumber || '',
      plateNumber: tuk.plateNumber || '',
      operatingArea: tuk.operatingArea || '',
      notes: tuk.notes || '',
    });
    setTukDialogOpen(true);
  };

  // ─── Submit Handlers ───────────────────────────────────────────────────────
  const handleSaveBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busForm.routeName || !busForm.startPoint || !busForm.endPoint || !busForm.departureTime) {
      toast.error('Please fill in all required fields (Route, Start, End, Departure).');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading(editingItem ? 'Updating bus route...' : 'Adding bus route...');
    try {
      if (editingItem) {
        await transportService.updateBusRoute(editingItem.id, busForm);
        toast.success('Bus route updated successfully!', { id: toastId });
      } else {
        await transportService.createBusRoute(busForm);
        toast.success('Bus route added successfully!', { id: toastId });
      }
      setBusDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save bus route.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainForm.routeName || !trainForm.startStation || !trainForm.endStation || !trainForm.departureTime) {
      toast.error('Please fill in all required fields (Route, Stations, Departure).');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading(editingItem ? 'Updating train schedule...' : 'Adding train schedule...');
    try {
      if (editingItem) {
        await transportService.updateTrainRoute(editingItem.id, trainForm);
        toast.success('Train schedule updated successfully!', { id: toastId });
      } else {
        await transportService.createTrainRoute(trainForm);
        toast.success('Train schedule added successfully!', { id: toastId });
      }
      setTrainDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save train schedule.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveTuk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tukForm.name || !tukForm.phoneNumber || !tukForm.plateNumber) {
      toast.error('Please fill in all required fields (Name, Phone, Plate).');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading(editingItem ? 'Updating tuk-tuk driver...' : 'Adding tuk-tuk driver...');
    try {
      if (editingItem) {
        await transportService.updateTukTukDriver(editingItem.id, tukForm);
        toast.success('Tuk-tuk driver updated successfully!', { id: toastId });
      } else {
        await transportService.createTukTukDriver(tukForm);
        toast.success('Tuk-tuk driver added successfully!', { id: toastId });
      }
      setTukDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save driver.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete Handlers ───────────────────────────────────────────────────────
  const handleOpenDelete = (id: number, type: TransportTab, title: string) => {
    setDeletingItem({ id, type, title });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    const toastId = toast.loading(`Deleting ${deletingItem.title}...`);
    try {
      if (deletingItem.type === 'bus') {
        await transportService.deleteBusRoute(deletingItem.id);
      } else if (deletingItem.type === 'train') {
        await transportService.deleteTrainRoute(deletingItem.id);
      } else if (deletingItem.type === 'tuk') {
        await transportService.deleteTukTukDriver(deletingItem.id);
      }
      toast.success(`${deletingItem.title} deleted successfully.`, { id: toastId });
      setDeleteConfirmOpen(false);
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete schedule item.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const glassStyles = {
    bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${accentAlpha(0.15)}`,
    borderRadius: '1.5rem',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  };

  return (
    <Paper sx={{ ...glassStyles, p: 4, mt: 4 }}>
      {/* ── Section Header ────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BusIcon sx={{ color: accent }} />
            Campus Transport Schedules
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Add, update, or remove bus schedules, train routes, and verified tuk-tuk drivers.
          </Typography>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder={`Search ${activeTab}...`}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 220 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.8rem',
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                '& fieldset': { borderColor: accentAlpha(0.2) },
                '&:hover fieldset': { borderColor: accentAlpha(0.4) },
                '&.Mui-focused fieldset': { borderColor: accent },
              },
            }}
          />

          <Tooltip title="Refresh schedules">
            <IconButton
              onClick={fetchData}
              disabled={loading}
              sx={{
                bgcolor: accentAlpha(0.1),
                color: accent,
                border: `1px solid ${accentAlpha(0.2)}`,
                p: 1.2,
                borderRadius: '12px',
                '&:hover': { bgcolor: accentAlpha(0.2) },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>

          {activeTab === 'bus' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddBus}
              sx={{
                bgcolor: accent,
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                px: 2.5,
                '&:hover': { bgcolor: '#25829e' },
              }}
            >
              Add Bus Route
            </Button>
          )}

          {activeTab === 'train' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddTrain}
              sx={{
                bgcolor: accent,
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                px: 2.5,
                '&:hover': { bgcolor: '#25829e' },
              }}
            >
              Add Train Schedule
            </Button>
          )}

          {activeTab === 'tuk' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddTuk}
              sx={{
                bgcolor: accent,
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                px: 2.5,
                '&:hover': { bgcolor: '#25829e' },
              }}
            >
              Add Tuk-Tuk Driver
            </Button>
          )}
        </Box>
      </Box>

      {/* Mode Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_e, val) => {
          setActiveTab(val);
          setSearchTerm('');
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          borderBottom: `1px solid ${accentAlpha(0.12)}`,
          '& .MuiTabs-indicator': { bgcolor: accent, height: 3 },
          '& .MuiTab-root': { color: 'text.secondary', fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
          '& .MuiTab-root.Mui-selected': { color: accent },
        }}
      >
        <Tab icon={<BusIcon />} iconPosition="start" label={`Bus Routes (${buses.length})`} value="bus" />
        <Tab icon={<TrainIcon />} iconPosition="start" label={`Train Schedules (${trains.length})`} value="train" />
        <Tab icon={<TukIcon />} iconPosition="start" label={`Tuk-Tuk Drivers (${tuks.length})`} value="tuk" />
      </Tabs>

      {/* ── 1. Bus Routes Table ───────────────────────────────────────── */}
      {activeTab === 'bus' && (
        <TableContainer sx={{ border: `1px solid ${accentAlpha(0.1)}`, borderRadius: '1rem', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Route Info</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Journey</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Departure / Arrival</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Bus Number</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: accent }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                      Loading bus routes...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredBuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <BusIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
                      No Bus Routes Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {searchTerm ? `No routes match "${searchTerm}"` : 'Click "Add Bus Route" above to create one.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBuses.map((bus) => (
                  <TableRow key={bus.id} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: accentAlpha(0.1), color: accent }}>
                          <BusIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{bus.routeName}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: #{bus.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{bus.startPoint}</Typography>
                        <ArrowIcon sx={{ fontSize: 14, color: accent }} />
                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{bus.endPoint}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<TimeIcon sx={{ color: `${accent} !important`, fontSize: 16 }} />}
                        label={bus.arrivalTime ? `${bus.departureTime} → ${bus.arrivalTime}` : bus.departureTime}
                        size="small"
                        sx={{
                          bgcolor: accentAlpha(0.1),
                          color: 'text.primary',
                          fontWeight: 700,
                          borderRadius: '8px',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>{bus.busNumber || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: 180 }}>{bus.notes || '—'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Route">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditBus(bus)}
                            sx={{ bgcolor: accentAlpha(0.08), '&:hover': { bgcolor: accentAlpha(0.18) } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Route">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDelete(bus.id, 'bus', bus.routeName)}
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.18)' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── 2. Train Routes Table ──────────────────────────────────────── */}
      {activeTab === 'train' && (
        <TableContainer sx={{ border: `1px solid ${accentAlpha(0.1)}`, borderRadius: '1rem', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Train Name & Route</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stations</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Departure / Arrival</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: accent }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                      Loading train schedules...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredTrains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <TrainIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
                      No Train Schedules Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {searchTerm ? `No trains match "${searchTerm}"` : 'Click "Add Train Schedule" above to create one.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrains.map((train) => (
                  <TableRow key={train.id} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: accentAlpha(0.1), color: accent }}>
                          <TrainIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{train.routeName}</Typography>
                          {train.trainName && (
                            <Typography variant="caption" sx={{ color: accent, fontWeight: 700 }}>
                              {train.trainName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{train.startStation}</Typography>
                        <ArrowIcon sx={{ fontSize: 14, color: accent }} />
                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{train.endStation}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<TimeIcon sx={{ color: `${accent} !important`, fontSize: 16 }} />}
                        label={train.arrivalTime ? `${train.departureTime} → ${train.arrivalTime}` : train.departureTime}
                        size="small"
                        sx={{
                          bgcolor: accentAlpha(0.1),
                          color: 'text.primary',
                          fontWeight: 700,
                          borderRadius: '8px',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: 180 }}>{train.notes || '—'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Schedule">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditTrain(train)}
                            sx={{ bgcolor: accentAlpha(0.08), '&:hover': { bgcolor: accentAlpha(0.18) } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDelete(train.id, 'train', train.routeName)}
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.18)' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── 3. Tuk-Tuk Drivers Table ───────────────────────────────────── */}
      {activeTab === 'tuk' && (
        <TableContainer sx={{ border: `1px solid ${accentAlpha(0.1)}`, borderRadius: '1rem', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Driver Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact Number</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vehicle Plate</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Operating Area</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: accent }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                      Loading tuk-tuk drivers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredTuks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <TukIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
                      No Tuk-Tuk Drivers Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {searchTerm ? `No drivers match "${searchTerm}"` : 'Click "Add Tuk-Tuk Driver" above to register one.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTuks.map((driver) => (
                  <TableRow key={driver.id} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: accentAlpha(0.1), color: accent }}>
                          <TukIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{driver.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: #{driver.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<PhoneIcon fontSize="small" />}
                        component="a"
                        href={`tel:${driver.phoneNumber}`}
                        sx={{ color: accent, textTransform: 'none', fontWeight: 700 }}
                      >
                        {driver.phoneNumber}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={driver.plateNumber}
                        size="small"
                        sx={{ bgcolor: accentAlpha(0.1), color: accent, fontWeight: 700, borderRadius: '8px' }}
                      />
                    </TableCell>
                    <TableCell>
                      {driver.operatingArea ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LocationIcon sx={{ fontSize: 16, color: accent }} />
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                            {driver.operatingArea}
                          </Typography>
                        </Stack>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: 180 }}>{driver.notes || '—'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Driver">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditTuk(driver)}
                            sx={{ bgcolor: accentAlpha(0.08), '&:hover': { bgcolor: accentAlpha(0.18) } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Driver">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDelete(driver.id, 'tuk', driver.name)}
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.18)' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Dialog 1: Bus Route Form ──────────────────────────────────── */}
      <Dialog
        open={busDialogOpen}
        onClose={() => !submitting && setBusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-surface)',
            borderRadius: '20px',
            p: 1,
            border: `1px solid ${accentAlpha(0.2)}`,
          },
        }}
      >
        <form onSubmit={handleSaveBus}>
          <DialogTitle sx={{ fontWeight: 800, color: 'text.primary' }}>
            {editingItem ? 'Edit Bus Route' : 'Add New Bus Route'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Route Name *"
                placeholder="e.g. Belihuloya - Colombo Express"
                value={busForm.routeName}
                onChange={(e) => setBusForm({ ...busForm, routeName: e.target.value })}
                fullWidth
                required
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Start Point *"
                  placeholder="e.g. Sabaragamuwa Campus Gate"
                  value={busForm.startPoint}
                  onChange={(e) => setBusForm({ ...busForm, startPoint: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="End Point *"
                  placeholder="e.g. Pettah Bus Stand"
                  value={busForm.endPoint}
                  onChange={(e) => setBusForm({ ...busForm, endPoint: e.target.value })}
                  fullWidth
                  required
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Departure Time *"
                  placeholder="e.g. 06:30 AM"
                  value={busForm.departureTime}
                  onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Arrival Time"
                  placeholder="e.g. 10:15 AM"
                  value={busForm.arrivalTime || ''}
                  onChange={(e) => setBusForm({ ...busForm, arrivalTime: e.target.value })}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Bus Number / Service Type"
                placeholder="e.g. ND-4521 (Semi-Luxury)"
                value={busForm.busNumber || ''}
                onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Notes / Stops / Schedule info"
                placeholder="e.g. Operates weekdays only via Expressway"
                value={busForm.notes || ''}
                onChange={(e) => setBusForm({ ...busForm, notes: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setBusDialogOpen(false)} disabled={submitting} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: accent, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#25829e' } }}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update Route' : 'Create Route'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Dialog 2: Train Schedule Form ────────────────────────────── */}
      <Dialog
        open={trainDialogOpen}
        onClose={() => !submitting && setTrainDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-surface)',
            borderRadius: '20px',
            p: 1,
            border: `1px solid ${accentAlpha(0.2)}`,
          },
        }}
      >
        <form onSubmit={handleSaveTrain}>
          <DialogTitle sx={{ fontWeight: 800, color: 'text.primary' }}>
            {editingItem ? 'Edit Train Schedule' : 'Add New Train Schedule'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Route Name *"
                placeholder="e.g. Udarata Menike (Main Line)"
                value={trainForm.routeName}
                onChange={(e) => setTrainForm({ ...trainForm, routeName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Train Name / Train Number"
                placeholder="e.g. Express 1005 (AC & 2nd Class)"
                value={trainForm.trainName || ''}
                onChange={(e) => setTrainForm({ ...trainForm, trainName: e.target.value })}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Start Station *"
                  placeholder="e.g. Colombo Fort"
                  value={trainForm.startStation}
                  onChange={(e) => setTrainForm({ ...trainForm, startStation: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="End Station *"
                  placeholder="e.g. Badulla"
                  value={trainForm.endStation}
                  onChange={(e) => setTrainForm({ ...trainForm, endStation: e.target.value })}
                  fullWidth
                  required
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Departure Time *"
                  placeholder="e.g. 05:55 AM"
                  value={trainForm.departureTime}
                  onChange={(e) => setTrainForm({ ...trainForm, departureTime: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Arrival Time"
                  placeholder="e.g. 03:30 PM"
                  value={trainForm.arrivalTime || ''}
                  onChange={(e) => setTrainForm({ ...trainForm, arrivalTime: e.target.value })}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Notes / Stops / Frequency"
                placeholder="e.g. Stops at Haputale, Bandarawela, Ella"
                value={trainForm.notes || ''}
                onChange={(e) => setTrainForm({ ...trainForm, notes: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setTrainDialogOpen(false)} disabled={submitting} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: accent, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#25829e' } }}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Dialog 3: Tuk-Tuk Driver Form ────────────────────────────── */}
      <Dialog
        open={tukDialogOpen}
        onClose={() => !submitting && setTukDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-surface)',
            borderRadius: '20px',
            p: 1,
            border: `1px solid ${accentAlpha(0.2)}`,
          },
        }}
      >
        <form onSubmit={handleSaveTuk}>
          <DialogTitle sx={{ fontWeight: 800, color: 'text.primary' }}>
            {editingItem ? 'Edit Tuk-Tuk Driver' : 'Add New Tuk-Tuk Driver'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Driver Full Name *"
                placeholder="e.g. Saman Kumara"
                value={tukForm.name}
                onChange={(e) => setTukForm({ ...tukForm, name: e.target.value })}
                fullWidth
                required
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Phone Number *"
                  placeholder="e.g. +94 77 123 4567"
                  value={tukForm.phoneNumber}
                  onChange={(e) => setTukForm({ ...tukForm, phoneNumber: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Plate Number *"
                  placeholder="e.g. WP AB-4523"
                  value={tukForm.plateNumber}
                  onChange={(e) => setTukForm({ ...tukForm, plateNumber: e.target.value })}
                  fullWidth
                  required
                />
              </Stack>
              <TextField
                label="Operating Area / Stand"
                placeholder="e.g. Sabaragamuwa Campus Main Gate, Belihuloya"
                value={tukForm.operatingArea || ''}
                onChange={(e) => setTukForm({ ...tukForm, operatingArea: e.target.value })}
                fullWidth
              />
              <TextField
                label="Notes / Availability"
                placeholder="e.g. Available 24/7 on call, accepts Cash & FriMi"
                value={tukForm.notes || ''}
                onChange={(e) => setTukForm({ ...tukForm, notes: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setTukDialogOpen(false)} disabled={submitting} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: accent, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#25829e' } }}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update Driver' : 'Register Driver'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Dialog 4: Delete Confirmation ────────────────────────────── */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !submitting && setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-surface)',
            borderRadius: '20px',
            p: 1,
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>
          Delete Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you sure you want to permanently delete <strong>"{deletingItem?.title}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={submitting} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#dc2626' } }}
          >
            {submitting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
