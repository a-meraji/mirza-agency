import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Search, Filter, X } from "lucide-react";
import { UserFilter } from "../../models/types";

interface UserFilterProps {
  onFilter: (filters: UserFilter) => void;
}

export default function UserFilterComponent({ onFilter }: UserFilterProps) {
  const [filters, setFilters] = useState<UserFilter>({
    searchTerm: "",
    role: "",
    status: "",
    ragSystemType: "",
    ragSystemStatus: ""
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      role: "",
      status: "",
      ragSystemType: "",
      ragSystemStatus: ""
    });
    onFilter({
      searchTerm: "",
      role: "",
      status: "",
      ragSystemType: "",
      ragSystemStatus: ""
    });
  };

  return (
    <div className="mb-6 bg-white rounded-lg p-4 border border-[#462d22]/20">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleInputChange}
              placeholder="جستجو بر اساس نام یا ایمیل..."
              className="w-full pl-10 pr-4 py-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#462d22]/50" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-[#462d22] rounded-lg flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>فیلترها</span>
            </Button>
            
            <Button
              type="submit"
              className="py-2 px-4 bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
            >
              اعمال
            </Button>
            
            {(filters.role || filters.status || filters.ragSystemType || filters.ragSystemStatus) && (
              <Button
                type="button"
                onClick={clearFilters}
                className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span>پاک کردن</span>
              </Button>
            )}
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#462d22] mb-1">نقش</label>
              <select
                id="role"
                name="role"
                value={filters.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="admin">مدیر</option>
                <option value="manager">سرپرست</option>
                <option value="user">کاربر</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[#462d22] mb-1">وضعیت</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="ragSystemType" className="block text-sm font-medium text-[#462d22] mb-1">نوع سیستم RAG</label>
              <select
                id="ragSystemType"
                name="ragSystemType"
                value={filters.ragSystemType}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="technical">فنی</option>
                <option value="management">مدیریتی</option>
                <option value="customer-service">خدمات مشتری</option>
                <option value="educational">آموزشی</option>
                <option value="data-analysis">تحلیل داده</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="ragSystemStatus" className="block text-sm font-medium text-[#462d22] mb-1">وضعیت سیستم RAG</label>
              <select
                id="ragSystemStatus"
                name="ragSystemStatus"
                value={filters.ragSystemStatus}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 