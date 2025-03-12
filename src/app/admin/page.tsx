"use client";

import { useState, useEffect } from "react";
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
  Mail,
  Phone,
  Tag,
  FileText,
  RefreshCw
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

// New interface for Blog type
interface Blog {
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  // New state for blogs
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  // New state for blog form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
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
  // New state for blog form data
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    date: "",
    tags: "",
    description: "",
    ogImage: ""
  });
  // New state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  // New useEffect to fetch blogs when the blogs tab is active
  useEffect(() => {
    if (activeTab === "blogs") {
      fetchBlogs();
    }
  }, [activeTab]);

  // New function to fetch blogs
  const fetchBlogs = async () => {
    try {
      setBlogLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setBlogLoading(false);
    }
  };

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

  // New handlers for blog form
  const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.md')) {
        setSelectedFile(file);
        setUploadMessage("");
        
        // Extract slug from filename
        const slug = file.name.replace('.md', '');
        
        // Update the form data with the slug
        setBlogFormData(prev => ({
          ...prev,
          slug
        }));
      } else {
        setSelectedFile(null);
        setUploadMessage("Please select a Markdown (.md) file");
      }
    }
  };

  // New function to handle blog creation
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadMessage("Please select a Markdown (.md) file");
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadMessage("");
      
      // First upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Add metadata
      const metadata = {
        title: blogFormData.title,
        slug: blogFormData.slug,
        date: blogFormData.date,
        tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        description: blogFormData.description,
        ogImage: blogFormData.ogImage
      };
      
      formData.append('metadata', JSON.stringify(metadata));
      
      const uploadResponse = await fetch('/api/blogs/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to upload blog');
      }
      
      // Create blog in database
      const createResponse = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      
      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.error || 'Failed to create blog in database');
      }
      
      const newBlog = await createResponse.json();
      
      // Add the new blog to the state
      setBlogs(prev => [newBlog, ...prev]);
      
      // Reset form
      setBlogFormData({
        title: "",
        slug: "",
        date: "",
        tags: "",
        description: "",
        ogImage: ""
      });
      setSelectedFile(null);
      setShowBlogForm(false);
      setUploadMessage("Blog post created successfully!");
      
      // Refresh blog list
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create blog'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // New function to handle blog update
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBlog) return;
    
    try {
      setIsUploading(true);
      
      const updateData = {
        id: editingBlog.id,
        title: blogFormData.title,
        slug: blogFormData.slug,
        date: blogFormData.date,
        tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        description: blogFormData.description,
        ogImage: blogFormData.ogImage
      };
      
      // Update blog in database
      const updateResponse = await fetch('/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.error || 'Failed to update blog');
      }
      
      const updatedBlog = await updateResponse.json();
      
      // Update the blog in the state
      setBlogs(prev => prev.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      ));
      
      // Reset form
      setBlogFormData({
        title: "",
        slug: "",
        date: "",
        tags: "",
        description: "",
        ogImage: ""
      });
      setEditingBlog(null);
      setShowBlogForm(false);
      setUploadMessage("Blog post updated successfully!");
      
      // Refresh blog list
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to update blog'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // New function to handle blog deletion
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog');
      }
      
      // Remove the blog from the state
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      setUploadMessage("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to delete blog'}`);
    }
  };

  // New function to start editing a blog
  const startEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title,
      slug: blog.slug,
      date: blog.date,
      tags: blog.tags.join(', '),
      description: blog.description,
      ogImage: blog.ogImage || ''
    });
    setShowBlogForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#462d22]">پنل مدیریت جلسات</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">مدیریت جلسات</TabsTrigger>
          <TabsTrigger value="bookings">رزروهای ثبت شده</TabsTrigger>
          <TabsTrigger value="blogs">مدیریت وبلاگ</TabsTrigger>
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
        
        <TabsContent value="blogs">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#462d22]">مدیریت مقالات وبلاگ</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={fetchBlogs}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 ml-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => {
                  setShowBlogForm(true);
                  setEditingBlog(null);
                  setBlogFormData({
                    title: "",
                    slug: "",
                    date: new Date().toISOString().split('T')[0],
                    tags: "",
                    description: "",
                    ogImage: ""
                  });
                  setSelectedFile(null);
                }}
                className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
              >
                <Plus className="ml-2 h-4 w-4" /> افزودن مقاله جدید
              </Button>
            </div>
          </div>
          
          {uploadMessage && (
            <div className={`mb-4 p-3 rounded-lg ${
              uploadMessage.includes('Error') 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {uploadMessage}
            </div>
          )}
          
          {showBlogForm && (
            <div className="mb-6 p-4 border border-[#462d22]/20 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-[#462d22]">
                {editingBlog ? "ویرایش مقاله" : "افزودن مقاله جدید"}
              </h3>
              
              <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#462d22] mb-1">عنوان</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={blogFormData.title}
                      onChange={handleBlogInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-[#462d22] mb-1">اسلاگ (URL)</label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={blogFormData.slug}
                      onChange={handleBlogInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-[#462d22] mb-1">تاریخ</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={blogFormData.date}
                      onChange={handleBlogInputChange}
                      required
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-[#462d22] mb-1">تگ‌ها (با کاما جدا کنید)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={blogFormData.tags}
                      onChange={handleBlogInputChange}
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                      placeholder="react, next.js, mongodb"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-[#462d22] mb-1">توضیحات</label>
                    <textarea
                      id="description"
                      name="description"
                      value={blogFormData.description}
                      onChange={handleBlogInputChange}
                      required
                      rows={3}
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="ogImage" className="block text-sm font-medium text-[#462d22] mb-1">تصویر Open Graph (URL)</label>
                    <input
                      type="text"
                      id="ogImage"
                      name="ogImage"
                      value={blogFormData.ogImage}
                      onChange={handleBlogInputChange}
                      placeholder="https://example.com/images/my-og-image.jpg"
                      className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">تصویری برای اشتراک‌گذاری در شبکه‌های اجتماعی (اندازه پیشنهادی: 1200×630 پیکسل)</p>
                  </div>
                  
                  {!editingBlog && (
                    <div className="md:col-span-2">
                      <label htmlFor="mdFile" className="block text-sm font-medium text-[#462d22] mb-1">فایل Markdown (.md)</label>
                      <input
                        type="file"
                        id="mdFile"
                        onChange={handleFileChange}
                        accept=".md"
                        className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">فقط فایل‌های با پسوند .md پذیرفته می‌شوند</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    type="button"
                    onClick={() => {
                      setShowBlogForm(false);
                      setEditingBlog(null);
                      setSelectedFile(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 ml-2"
                  >
                    انصراف
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={isUploading || (!editingBlog && !selectedFile)}
                    className={`${
                      isUploading || (!editingBlog && !selectedFile)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#fbeee0] border-2 border-[#422800] shadow-[4px_4px_0_0_#422800] hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]'
                    } rounded-[30px] text-[#422800] font-semibold px-4 py-2 text-center no-underline select-none`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="inline h-4 w-4 animate-spin ml-2" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      editingBlog ? "بروزرسانی" : "ایجاد"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {blogLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
              <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#462d22]/30 rounded-lg">
              <p className="text-[#462d22]/70">هیچ مقاله‌ای یافت نشد. مقاله جدیدی ایجاد کنید.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border border-[#462d22]/20 rounded-lg p-4 bg-[#fff6e8ec] backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#462d22] text-lg">{blog.title}</h3>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-[#ffa620] ml-1" />
                        <span className="text-sm text-[#462d22]/70">{blog.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <FileText className="h-4 w-4 text-[#ffa620] ml-1" />
                        <span className="text-sm text-[#462d22]/70">{blog.slug}.md</span>
                      </div>
                      
                      <p className="mt-3 text-[#462d22]/80">{blog.description}</p>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center mb-1">
                            <Tag className="h-4 w-4 text-[#ffa620] ml-1" />
                            <span className="text-sm font-medium text-[#462d22]">تگ‌ها:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="bg-[#ffa620]/10 text-[#462d22] text-xs px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 md:mt-0 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                      <Button
                        onClick={() => startEditBlog(blog)}
                        className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2 md:ml-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-[#462d22]/50 flex justify-between">
                    <div>ایجاد: {new Date(blog.createdAt).toLocaleDateString('fa-IR')}</div>
                    <div>بروزرسانی: {new Date(blog.updatedAt).toLocaleDateString('fa-IR')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 