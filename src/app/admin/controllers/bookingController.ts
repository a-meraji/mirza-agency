import { Booking, BookingFormData } from "../models/types";

export const fetchBookings = async (): Promise<Booking[]> => {
  const bookingsRes = await fetch("/api/bookings");
  const bookingsData = await bookingsRes.json();
  return bookingsData;
};

export const updateBooking = async (id: string, formData: BookingFormData): Promise<Booking> => {
  const { name, email, phone, notes, selectedServices } = formData;
  
  const response = await fetch(`/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      notes,
      selectedServices,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
};

export const deleteBooking = async (id: string): Promise<void> => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
}; 