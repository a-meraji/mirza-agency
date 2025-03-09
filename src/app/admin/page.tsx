"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns-jalali";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Button } from "@/components/UI/button";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash, 
  Loader2,
  User,
  Mail,
  Phone
} from "lucide-react";
import fa from "date-fns/locale/fa-IR";

// Define interfaces for our data types
interface Booking {
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

interface Appointment {
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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: 60
  });
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    selectedServices: [] as string[]
  });

  // Fetch appointments and bookings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch appointments with all data (including booked ones)
        const appointmentsRes = await fetch("/api/appointments?showAll=true");
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);

        // Fetch bookings
        const bookingsRes = await fetch("/api/bookings");
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "selectedServices") {
      // Handle the services array
      const servicesArray = value.split(',').map(service => service.trim());
      setBookingFormData((prev) => ({ ...prev, [name]: servicesArray }));
    } else {
      setBookingFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
      
      if (response.ok) {
        const newAppointment = await response.json();
        setAppointments((prev) => [...prev, newAppointment]);
        setShowForm(false);
        setFormData({
          date: "",
          startTime: "",
          endTime: "",
          duration: 60,
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment");
    }
  };

  const handleEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAppointment) return;
    
    try {
      const { date, startTime, endTime, duration } = formData;
      
      // Combine date and time for API
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;
      
      const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
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
      
      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prev) => 
          prev.map((app) => app.id === updatedAppointment.id ? updatedAppointment : app)
        );
        setShowForm(false);
        setEditingAppointment(null);
        setFormData({
          date: "",
          startTime: "",
          endTime: "",
          duration: 60,
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment");
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBooking) return;
    
    try {
      const { name, email, phone, notes, selectedServices } = bookingFormData;
      
      const response = await fetch(`/api/bookings/${editingBooking.id}`, {
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
      
      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings((prev) => 
          prev.map((booking) => booking.id === updatedBooking.id ? updatedBooking : booking)
        );
        setShowBookingForm(false);
        setEditingBooking(null);
        setBookingFormData({
          name: "",
          email: "",
          phone: "",
          notes: "",
          selectedServices: []
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking? The appointment will become available again.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Remove the booking from the list
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
        
        // Refresh appointments to show the updated availability
        const appointmentsRes = await fetch("/api/appointments?showAll=true");
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const startEdit = (appointment: Appointment) => {
    // Format date and time for form inputs
    const date = new Date(appointment.date);
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    
    setFormData({
      date: format(date, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      duration: appointment.duration,
    });
    
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const startEditBooking = (booking: Booking) => {
    setBookingFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone || "",
      notes: booking.notes || "",
      selectedServices: booking.selectedServices || []
    });
    
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#462d22]">پنل مدیریت جلسات</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">مدیریت جلسات</TabsTrigger>
          <TabsTrigger value="bookings">رزروهای ثبت شده</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#462d22]">جلسات موجود</h2>
            <Button 
              onClick={() => {
                setShowForm(true);
                setEditingAppointment(null);
                setFormData({
                  date: "",
                  startTime: "",
                  endTime: "",
                  duration: 60,
                });
              }}
              className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
            >
              <Plus className="ml-2 h-4 w-4" /> افزودن جلسه جدید
            </Button>
          </div>
          
          {showForm && (
            <div className="mb-6 p-4 border border-[#462d22]/20 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-[#462d22]">
                {editingAppointment ? "ویرایش جلسه" : "افزودن جلسه جدید"}
              </h3>
              
              <form onSubmit={editingAppointment ? handleEditAppointment : handleCreateAppointment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-[#462d22] mb-1">تاریخ</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-[#462d22] mb-1">مدت زمان (دقیقه)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="15"
                      step="15"
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-[#462d22] mb-1">زمان شروع</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-[#462d22] mb-1">زمان پایان</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAppointment(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 ml-2"
                  >
                    انصراف
                  </Button>
                  
                  <Button 
                    type="submit"
                    className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
                  >
                    {editingAppointment ? "بروزرسانی" : "ایجاد"}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
              <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#462d22]/30 rounded-lg">
              <p className="text-[#462d22]/70">هیچ جلسه‌ای یافت نشد. جلسه جدیدی ایجاد کنید.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#462d22]/10">
                    <th className="p-3 text-right text-[#462d22] font-semibold">تاریخ</th>
                    <th className="p-3 text-right text-[#462d22] font-semibold">زمان</th>
                    <th className="p-3 text-right text-[#462d22] font-semibold">مدت (دقیقه)</th>
                    <th className="p-3 text-right text-[#462d22] font-semibold">وضعیت</th>
                    <th className="p-3 text-right text-[#462d22] font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const date = new Date(appointment.date);
                    const startTime = new Date(appointment.startTime);
                    const endTime = new Date(appointment.endTime);
                    
                    return (
                      <tr key={appointment.id} className="border-b border-[#462d22]/10">
                        <td className="p-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-[#ffa620] ml-2" />
                            {format(date, 'EEEE dd MMMM yyyy', { locale: fa })}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-[#ffa620] ml-2" />
                            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                          </div>
                        </td>
                        <td className="p-3">{appointment.duration}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.isBooked 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {appointment.isBooked ? "رزرو شده" : "آزاد"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => startEdit(appointment)}
                              disabled={appointment.isBooked}
                              className={`p-1 rounded ${
                                appointment.isBooked 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              } ml-2`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          <h2 className="text-xl font-semibold mb-4 text-[#462d22]">رزروهای ثبت شده</h2>
          
          {showBookingForm && (
            <div className="mb-6 p-4 border border-[#462d22]/20 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-[#462d22]">
                ویرایش اطلاعات رزرو
              </h3>
              
              <form onSubmit={handleEditBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#462d22] mb-1">نام</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingFormData.name}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#462d22] mb-1">ایمیل</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingFormData.email}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#462d22] mb-1">تلفن</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={bookingFormData.phone}
                      onChange={handleBookingInputChange}
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="selectedServices" className="block text-sm font-medium text-[#462d22] mb-1">خدمات انتخاب شده (با کاما جدا کنید)</label>
                    <input
                      type="text"
                      id="selectedServices"
                      name="selectedServices"
                      value={bookingFormData.selectedServices.join(', ')}
                      onChange={handleBookingInputChange}
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-[#462d22] mb-1">یادداشت</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={bookingFormData.notes}
                      onChange={handleBookingInputChange}
                      rows={3}
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setEditingBooking(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 ml-2"
                  >
                    انصراف
                  </Button>
                  
                  <Button 
                    type="submit"
                    className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
                  >
                    بروزرسانی
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
              <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#462d22]/30 rounded-lg">
              <p className="text-[#462d22]/70">هیچ رزروی ثبت نشده است.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                // Add defensive check for availableAppointment
                if (!booking.availableAppointment) {
                  console.error(`Booking ${booking.id} is missing availableAppointment data`);
                  return (
                    <div key={booking.id} className="p-4 border rounded-lg bg-red-50 border-red-300">
                      <p className="text-red-500 font-medium">Error: Missing appointment data for booking {booking.id}</p>
                      <div className="mt-2">
                        <p><span className="font-medium">Name:</span> {booking.name}</p>
                        <p><span className="font-medium">Email:</span> {booking.email}</p>
                        <p><span className="font-medium">Phone:</span> {booking.phone || 'N/A'}</p>
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => startEditBooking(booking)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                const appointment = booking.availableAppointment;
                const date = new Date(appointment.date);
                const startTime = new Date(appointment.startTime);
                const endTime = new Date(appointment.endTime);
                
                return (
                  <div key={booking.id} className="border border-[#462d22]/20 rounded-lg p-4 bg-[#fff6e8ec] backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <div>
                        <h3 className="font-semibold text-[#462d22]">{booking.name}</h3>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 text-[#ffa620] ml-1" />
                          <span className="text-sm text-[#462d22]/70">{booking.email}</span>
                        </div>
                        {booking.phone && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-[#ffa620] ml-1" />
                            <span className="text-sm text-[#462d22]/70">{booking.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#ffa620] ml-2" />
                          <span>{format(date, 'EEEE dd MMMM yyyy', { locale: fa })}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 text-[#ffa620] ml-2" />
                          <span>{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {booking.selectedServices && booking.selectedServices.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-[#462d22] mb-1">خدمات انتخاب شده:</h4>
                        <div className="flex flex-wrap gap-2">
                          {booking.selectedServices.map((service, index) => (
                            <span 
                              key={index}
                              className="bg-[#ffa620]/10 text-[#462d22] text-xs px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {booking.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-[#462d22] mb-1">یادداشت:</h4>
                        <p className="text-sm text-[#462d22]/70 bg-gray-50 p-2 rounded">{booking.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-[#462d22]/50">
                        تاریخ ثبت: {format(new Date(booking.createdAt), 'yyyy/MM/dd HH:mm')}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startEditBooking(booking)}
                          className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 