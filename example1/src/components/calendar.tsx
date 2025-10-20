import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAvailableSlots } from '../store/features/appointmentsSlice';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availableSlots, loading } = useAppSelector((state) => state.appointments);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString();
      dispatch(fetchAvailableSlots(dateString));
    }
  }, [selectedDate, dispatch]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Available Time Slots
        </Typography>
        
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          sx={{ mb: 3 }}
        />

        {loading && <Typography>Loading available slots...</Typography>}
        
        {!loading && availableSlots.length === 0 && (
          <Typography>No available slots for selected date</Typography>
        )}

        <Grid container spacing={2}>
          {availableSlots.map((slot, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {format(parseISO(slot.start_time), 'HH:mm')} -{' '}
                    {format(parseISO(slot.end_time), 'HH:mm')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => {
                      // This would open the appointment form with pre-filled time
                      console.log('Selected slot:', slot);
                    }}
                  >
                    Book This Slot
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default Calendar;