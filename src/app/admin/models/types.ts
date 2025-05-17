// Define interfaces for our data types
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  selectedServices: string[];
  createdAt: string;
  appointmentId: string;
  availableAppointment: Appointment;
}

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  selectedServices: string[];
}

export interface BlogFormData {
  title: string;
  slug: string;
  date: string;
  tags: string;
  description: string;
  ogImage: string;
}

// User and RAG System interfaces
export interface RAGSystem {
  id: string;
  name: string;
  description?: string;
  user: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  searchTerm: string;
  role: string;
  status: string;
  ragSystemType: string;
  ragSystemStatus: string;
}

// Payment interface
export interface Payment {
  id: string;
  user: string | { id: string; email: string; name?: string };
  amount: number;
  currency: 'dollar' | 'rial';
  createdAt: string;
  updatedAt: string;
}

// Payment filter interface
export interface PaymentFilter {
  startDate: string;
  endDate: string;
  userId: string;
  currency: string;
} 