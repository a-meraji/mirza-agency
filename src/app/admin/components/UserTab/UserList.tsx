import { format } from "date-fns-jalali";
import { Mail, Phone, Calendar, Activity, User as UserIcon, MoreVertical, Loader2, Key, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/UI/button";
import { User } from "../../models/types";
import { useState, Fragment } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import UserRagSystems from "./UserRagSystems";

interface UserListProps {
  users: User[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

export default function UserList({ users, loading, onStatusChange }: UserListProps) {
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});

  // Toggle expanded state for a user
  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Handle status change with loading state
  const handleStatusChange = async (id: string, status: string) => {
    setStatusUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await onStatusChange(id, status);
    } finally {
      setStatusUpdating(prev => ({ ...prev, [id]: false }));
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        هیچ کاربری یافت نشد
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'نامشخص';
    return format(new Date(dateString), 'yyyy/MM/dd - HH:mm');
  };
  
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleTranslation = (role: string): string => {
    switch(role) {
      case 'admin':
        return 'مدیر';
      case 'manager':
        return 'سرپرست';
      case 'user':
        return 'کاربر';
      default:
        return role;
    }
  };
  
  const getStatusTranslation = (status: string): string => {
    switch(status) {
      case 'active':
        return 'فعال';
      case 'inactive':
        return 'غیرفعال';
      case 'suspended':
        return 'معلق';
      default:
        return status;
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                کاربر
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ایمیل
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نقش
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاریخ عضویت
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
      {users.map(user => (
              <Fragment key={user.id}>
                <tr 
                  className={`hover:bg-gray-50 transition-colors ${expandedUsers[user.id] ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end">
                <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'بدون نام'}
                  </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.id}
                </div>
              </div>
            </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <div className="text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'ادمین' : 'کاربر'}
              </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <Select 
                      defaultValue={user.status} 
                      onValueChange={(value: string) => handleStatusChange(user.id, value)}
                      disabled={statusUpdating[user.id]}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue>
                          {statusUpdating[user.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              {user.status === 'active' && 'فعال'}
                              {user.status === 'inactive' && 'غیرفعال'}
                              {user.status === 'suspended' && 'معلق'}
                            </>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">فعال</SelectItem>
                        <SelectItem value="inactive">غیرفعال</SelectItem>
                        <SelectItem value="suspended">معلق</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                      onClick={() => toggleUserExpanded(user.id)}
                      className="flex items-center text-blue-600 hover:text-blue-900"
                    >
                      {expandedUsers[user.id] ? (
                        <>
                          <span>بستن</span>
                          <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          <span>نمایش سیستم‌های RAG</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                        </button>
                  </td>
                </tr>
                {expandedUsers[user.id] && (
                  <tr>
                    <td colSpan={6} className="px-4 py-4">
                      <UserRagSystems userId={user.id} userName={user.name || 'کاربر'} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
} 