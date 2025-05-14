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
  type: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  modelType?: string;
  embeddingModel?: string;
  storageSize?: number;
  documentCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  phone?: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  ragSystems: RAGSystem[];
}

export interface UserFilter {
  searchTerm: string;
  role?: string;
  status?: string;
  ragSystemType?: string;
  ragSystemStatus?: string;
} 