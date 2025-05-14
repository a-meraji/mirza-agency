import { format } from "date-fns-jalali";
import { Calendar, Clock, Mail, Phone, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/UI/button";
import fa from "date-fns/locale/fa-IR";
import { Booking } from "../../models/types";

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export default function BookingList({ 
  bookings, 
  loading, 
  onEdit, 
  onDelete 
}: BookingListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
        <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 border bg-gray-50 border-dashed border-[#462d22]/30 rounded-lg">
        <p className="text-[#462d22]/70">هیچ رزروی ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-50">
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
                    onClick={() => onEdit(booking)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(booking.id)}
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
                  onClick={() => onEdit(booking)}
                  className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => onDelete(booking.id)}
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
  );
} 