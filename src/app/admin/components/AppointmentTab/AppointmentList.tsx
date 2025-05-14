import { format } from "date-fns-jalali";
import { Calendar, Clock, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/UI/button";
import fa from "date-fns/locale/fa-IR";
import { Appointment } from "../../models/types";

interface AppointmentListProps {
  appointments: Appointment[];
  loading: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentList({ 
  appointments, 
  loading, 
  onEdit, 
  onDelete 
}: AppointmentListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
        <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-[#462d22]/30 bg-gray-50 rounded-lg">
        <p className="text-[#462d22]/70">هیچ جلسه‌ای یافت نشد. جلسه جدیدی ایجاد کنید.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl">
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
                      onClick={() => onEdit(appointment)}
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
                      onClick={() => onDelete(appointment.id)}
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
  );
} 