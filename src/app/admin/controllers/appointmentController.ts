import { Appointment, AppointmentFormData } from "../models/types";

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const appointmentsRes = await fetch("/api/appointments?showAll=true");
  const appointmentsData = await appointmentsRes.json();
  return appointmentsData;
};

export const createAppointment = async (formData: AppointmentFormData): Promise<Appointment> => {
  const { date, startTime, endTime, duration } = formData;
  
  // Combine date and time for API
  const startDateTime = `${date}T${startTime}:00`;
  const endDateTime = `${date}T${endTime}:00`;
  
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
};

export const updateAppointment = async (id: string, formData: AppointmentFormData): Promise<Appointment> => {
  const { date, startTime, endTime, duration } = formData;
  
  // Combine date and time for API
  const startDateTime = `${date}T${startTime}:00`;
  const endDateTime = `${date}T${endTime}:00`;
  
  const response = await fetch(`/api/appointments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/appointments/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
}; 