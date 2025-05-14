import { useState, useEffect } from "react";
import { RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/UI/button";
import UserFilterComponent from "./UserFilter";
import UserList from "./UserList";
import { User, UserFilter } from "../../models/types";
import { 
  fetchUsers, 
  filterUsers, 
  updateUserStatus
} from "../../controllers/userController";

export default function UserTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilter>({
    searchTerm: "",
    role: "",
    status: "",
    ragSystemType: "",
    ragSystemStatus: ""
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null);

  // Load users on initial mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (Object.values(filters).some(val => val !== "")) {
      applyFilters(filters);
    }
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setNotification(null);
    } catch (error) {
      console.error("Error loading users:", error);
      setError(`خطا در بارگذاری کاربران: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      setNotification({
        type: 'error',
        message: `خطا در بارگذاری کاربران: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filterData: UserFilter) => {
    setLoading(true);
    setError(null);
    try {
      const filteredUsers = await filterUsers(filterData);
      setUsers(filteredUsers);
      setNotification(null);
    } catch (error) {
      console.error("Error applying filters:", error);
      setError(`خطا در اعمال فیلترها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      setNotification({
        type: 'error',
        message: `خطا در اعمال فیلترها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: UserFilter) => {
    setFilters(newFilters);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updatedUser = await updateUserStatus(id, status);
      
      // Update the users list with the updated user
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, status: status as 'active' | 'inactive' | 'suspended' };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setNotification({
        type: 'success',
        message: `وضعیت کاربر با موفقیت تغییر کرد`
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating user status:", error);
      setNotification({
        type: 'error',
        message: `خطا در بروزرسانی وضعیت کاربر: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
      });
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#462d22] flex items-center">
          <Users className="ml-2 h-5 w-5" />
          مدیریت کاربران و سیستم‌های RAG
        </h2>
        
        <Button 
          onClick={loadUsers}
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-[#462d22] rounded-lg flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>بارگذاری مجدد</span>
        </Button>
      </div>
      
      {notification && (
        <div className={`mb-4 p-3 rounded-lg ${
          notification.type === 'error' 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : 'bg-green-100 text-green-800 border border-green-300'
        }`}>
          {notification.message}
        </div>
      )}
      
      {error && !notification && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300">
          {error}
        </div>
      )}
      
      <UserFilterComponent onFilter={handleFilterChange} />
      
      <UserList 
        users={users}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </>
  );
} 