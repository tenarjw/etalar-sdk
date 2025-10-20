import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createAppointment, clearError } from '../store/features/appointmentsSlice';
import { Appointment } from '../types/appointment';

const AppointmentForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.appointments);
  
  const [formData, setFormData] = useState<Omit<Appointment, 'id' | 'created_at' | 'is_confirmed'>>({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString(),
    duration: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAppointment(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Schedule Appointment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date and Time"
              name="date"
              type="datetime-local"
              value={formData.date.slice(0, 16)}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AppointmentForm;