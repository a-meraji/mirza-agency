import { useState, useEffect } from "react";
import { Search, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/UI/button";
import { PaymentFilter } from "../../models/types";

interface PaymentFilterComponentProps {
  onFilter: (filters: PaymentFilter) => void;
}

export default function PaymentFilterComponent({ onFilter }: PaymentFilterComponentProps) {
  const [filters, setFilters] = useState<PaymentFilter>({
    startDate: "",
    endDate: "",
    userId: "",
    currency: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      userId: "",
      currency: ""
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  // Set today as the default end date when component mounts
  useEffect(() => {
    // Only set if not already set
    if (!filters.endDate) {
      const today = new Date().toISOString().split('T')[0];
      setFilters(prev => ({
        ...prev,
        endDate: today
      }));
    }
  }, []);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Search className="ml-2 h-4 w-4" />
        فیلتر پرداخت‌ها
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="ml-1 h-4 w-4" />
              از تاریخ
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="ml-1 h-4 w-4" />
              تا تاریخ
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <User className="ml-1 h-4 w-4" />
              شناسه کاربر
            </label>
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleChange}
              placeholder="شناسه کاربر را وارد کنید"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="ml-1 h-4 w-4" />
              نوع ارز
            </label>
            <select
              name="currency"
              value={filters.currency}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
            >
              <option value="">همه</option>
              <option value="dollar">دلار</option>
              <option value="rial">ریال</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            پاک کردن
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-[#ffa620] text-white hover:bg-[#ffa620]/90 rounded-md mr-2"
          >
            اعمال فیلتر
          </Button>
        </div>
      </form>
    </div>
  );
} 