import { useState, useEffect } from "react";
import BookingList from "./BookingList";
import BookingForm from "./BookingForm";
import { Booking, BookingFormData } from "../../models/types";
import { 
  fetchBookings, 
  updateBooking, 
  deleteBooking 
} from "../../controllers/bookingController";
import { fetchAppointments } from "../../controllers/appointmentController";

export default function BookingTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleUpdateBooking = async (formData: BookingFormData) => {
    if (!editingBooking) return;
    
    try {
      const updatedBooking = await updateBooking(editingBooking.id, formData);
      setBookings((prev) => 
        prev.map((booking) => booking.id === updatedBooking.id ? updatedBooking : booking)
      );
      setShowForm(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update booking"}`);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking? The appointment will become available again.")) {
      return;
    }
    
    try {
      await deleteBooking(id);
      
      // Remove the booking from the list
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      
      // Refresh appointments is handled in the parent component
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to delete booking"}`);
    }
  };

  const startEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingBooking(null);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-[#462d22]">رزروهای ثبت شده</h2>
      
      {showForm && (
        <BookingForm 
          editingBooking={editingBooking}
          onSubmit={handleUpdateBooking}
          onCancel={cancelForm}
        />
      )}
      
      <BookingList 
        bookings={bookings}
        loading={loading}
        onEdit={startEditBooking}
        onDelete={handleDeleteBooking}
      />
    </>
  );
} 