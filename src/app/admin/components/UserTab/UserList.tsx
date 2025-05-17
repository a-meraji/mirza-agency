import { format } from "date-fns-jalali";
import { Mail, Phone, Calendar, Activity, User as UserIcon, MoreVertical, Loader2, Key, Copy, ChevronDown, ChevronUp, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/UI/button";
import { User } from "../../models/types";
import { useState, Fragment, useEffect } from "react";
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
  const [copyingKeys, setCopyingKeys] = useState<Record<string, boolean>>({});
  const [copyingEmails, setCopyingEmails] = useState<Record<string, boolean>>({});
  const [copyingIds, setCopyingIds] = useState<Record<string, boolean>>({});

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
  
  // Copy API key to clipboard
  const copyApiKey = async (apiKey: string, userId: string) => {
    if (!apiKey) return;
    
    setCopyingKeys(prev => ({ ...prev, [userId]: true }));
    try {
      await navigator.clipboard.writeText(apiKey);
      
      // Auto reset after 1 second
      setTimeout(() => {
        setCopyingKeys(prev => ({ ...prev, [userId]: false }));
      }, 1000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
      setCopyingKeys(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Copy email to clipboard
  const copyEmail = async (email: string, userId: string) => {
    if (!email) return;
    
    setCopyingEmails(prev => ({ ...prev, [userId]: true }));
    try {
      await navigator.clipboard.writeText(email);
      
      // Auto reset after 1 second
      setTimeout(() => {
        setCopyingEmails(prev => ({ ...prev, [userId]: false }));
      }, 1000);
    } catch (err) {
      console.error("Failed to copy email:", err);
      setCopyingEmails(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Copy user ID to clipboard
  const copyId = async (id: string) => {
    if (!id) return;
    
    setCopyingIds(prev => ({ ...prev, [id]: true }));
    try {
      await navigator.clipboard.writeText(id);
      
      // Auto reset after 1 second
      setTimeout(() => {
        setCopyingIds(prev => ({ ...prev, [id]: false }));
      }, 1000);
    } catch (err) {
      console.error("Failed to copy user ID:", err);
      setCopyingIds(prev => ({ ...prev, [id]: false }));
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
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <Fragment key={user.id}>
                <tr className={`hover:bg-gray-50 transition-colors ${expandedUsers[user.id] ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => toggleUserExpanded(user.id)}
                      className="text-left focus:outline-none"
                    >
                      <div className="flex items-center justify-end">
                        <div>
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {user.name || 'بدون نام'}
                          </div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center text-gray-900">
                      {user.email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => copyEmail(user.email, user.id)}
                      >
                        {copyingEmails[user.id] ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                          <span>نمایش جزئیات</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedUsers[user.id] && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">اطلاعات کاربر</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">نقش:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role === 'admin' ? 'ادمین' : 'کاربر'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">شناسه:</span>
                        
                                <div className="flex items-center">
                                  <div className="max-w-[120px] overflow-hidden text-ellipsis bg-gray-100 px-2 py-1 rounded-md text-xs">
                                    {user.id}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => copyId(user.id)}
                                    disabled={copyingIds[user.id]}
                                  >
                                    {copyingIds[user.id] ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">وضعیت:</span>
                              <Select 
                                defaultValue={user.status} 
                                onValueChange={(value: string) => handleStatusChange(user.id, value)}
                                disabled={statusUpdating[user.id]}
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue>
                                    {statusUpdating[user.id] ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
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
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">تاریخ عضویت:</span>
                              <span className="text-xs">{formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">کلید API:</span>
                              {user.apiKey ? (
                                <div className="flex items-center">
                                  <div className="max-w-[120px] overflow-hidden text-ellipsis bg-gray-100 px-2 py-1 rounded-md text-xs">
                                    {user.apiKey}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => copyApiKey(user.apiKey || '', user.id)}
                                    disabled={copyingKeys[user.id]}
                                  >
                                    {copyingKeys[user.id] ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">بدون کلید API</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white md:col-span-2 p-4 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">سیستم‌های RAG</h3>
                          <UserRagSystems userId={user.id} userName={user.name || 'کاربر'} />
                        </div>
                      </div>
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