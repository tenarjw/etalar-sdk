import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAppointments } from '../store/features/appointmentsSlice';
import { format, parseISO } from 'date-fns';

const AppointmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Scheduled Appointments
      </Typography>

      {loading && <Typography>Loading appointments...</Typography>}

      {!loading && appointments.length === 0 && (
        <Typography>No appointments scheduled yet</Typography>
      )}

      <List>
        {appointments.map((appointment) => (
          <ListItem
            key={appointment.id}
            divider
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={appointment.name}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.primary">
                    {format(parseISO(appointment.date), 'PPP p')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.email} • {appointment.phone}
                  </Typography>
                  <Chip
                    label={appointment.is_confirmed ? 'Confirmed' : 'Pending'}
                    color={appointment.is_confirmed ? 'success' : 'warning'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AppointmentList;