import { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import { Booking, BookingFormData } from "../../models/types";

interface BookingFormProps {
  editingBooking: Booking | null;
  onSubmit: (formData: BookingFormData) => void;
  onCancel: () => void;
}

export default function BookingForm({ 
  editingBooking, 
  onSubmit, 
  onCancel 
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    selectedServices: []
  });

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        name: editingBooking.name,
        email: editingBooking.email,
        phone: editingBooking.phone || "",
        notes: editingBooking.notes || "",
        selectedServices: editingBooking.selectedServices || []
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        notes: "",
        selectedServices: []
      });
    }
  }, [editingBooking]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "selectedServices") {
      // Handle the services array
      const servicesArray = value.split(',').map(service => service.trim());
      setFormData((prev) => ({ ...prev, [name]: servicesArray }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="mb-6 p-4 border bg-gray-50 border-[#462d22]/20 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-[#462d22]">
        ویرایش اطلاعات رزرو
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#462d22] mb-1">نام</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="selectedServices" className="block text-sm font-medium text-[#462d22] mb-1">خدمات انتخاب شده (با کاما جدا کنید)</label>
            <input
              type="text"
              id="selectedServices"
              name="selectedServices"
              value={formData.selectedServices.join(', ')}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-[#462d22] mb-1">یادداشت</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
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
            بروزرسانی
          </Button>
        </div>
      </form>
    </div>
  );
} 