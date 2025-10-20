export interface Appointment {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  date: string;
  duration: number;
  created_at?: string;
  is_confirmed?: boolean;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
}

export interface Event {
  title: string;
  start: Date;
  end: Date;
}

