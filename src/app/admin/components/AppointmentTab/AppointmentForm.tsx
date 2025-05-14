import { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import { Appointment, AppointmentFormData } from "../../models/types";

interface AppointmentFormProps {
  editingAppointment: Appointment | null;
  onSubmit: (formData: AppointmentFormData) => void;
  onCancel: () => void;
}

export default function AppointmentForm({ 
  editingAppointment, 
  onSubmit, 
  onCancel 
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: "",
    startTime: "",
    endTime: "",
    duration: 60
  });

  useEffect(() => {
    if (editingAppointment) {
      // Format date and time for form inputs
      const date = new Date(editingAppointment.date);
      const startTime = new Date(editingAppointment.startTime);
      const endTime = new Date(editingAppointment.endTime);
      
      setFormData({
        date: formatDateForInput(date),
        startTime: formatTimeForInput(startTime),
        endTime: formatTimeForInput(endTime),
        duration: editingAppointment.duration,
      });
    } else {
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        duration: 60
      });
    }
  }, [editingAppointment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  return (
    <div className="mb-6 p-4 border bg-gray-50 border-[#462d22]/20 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-[#462d22]">
        {editingAppointment ? "ویرایش جلسه" : "افزودن جلسه جدید"}
      </h3>
      
      <form onSubmit={handleSubmit}>
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
            onClick={onCancel}
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
  );
} 