import { format } from "date-fns-jalali";
import { Mail, Phone, Calendar, Activity, User as UserIcon, MoreVertical, Loader2, Key, Copy } from "lucide-react";
import { Button } from "@/components/UI/button";
import { User } from "../../models/types";
import UserRagInfo from "./UserRagInfo";
import { useState } from "react";

interface UserListProps {
  users: User[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
}

export default function UserList({ users, loading, onStatusChange }: UserListProps) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
        <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed bg-gray-50 border-[#462d22]/30 rounded-lg">
        <p className="text-[#462d22]/70">هیچ کاربری یافت نشد. لطفا معیارهای جستجو را تغییر دهید.</p>
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
  
  const toggleExpand = (id: string) => {
    if (expandedUser === id) {
      setExpandedUser(null);
    } else {
      setExpandedUser(id);
    }
    // Close any open menu
    setShowMenu(null);
  };
  
  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showMenu === id) {
      setShowMenu(null);
    } else {
      setShowMenu(id);
    }
  };
  
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div 
          key={user.id} 
          className="bg-white rounded-lg shadow border border-[#462d22]/10 overflow-hidden"
        >
          <div 
            className="p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer"
            onClick={() => toggleExpand(user.id)}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fbeee0] flex items-center justify-center text-[#462d22] ml-3">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#462d22]">{user.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 ml-1" />
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="md:mr-6 mt-2 md:mt-0">
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 text-[#ffa620] ml-1" />
                  <span>{user.phone || 'بدون شماره تلفن'}</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Activity className="h-3 w-3 text-[#ffa620] ml-1" />
                  <span className="text-gray-600">نقش:</span>
                  <span className="mr-1">{getRoleTranslation(user.role)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-3 md:mt-0">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                {getStatusTranslation(user.status)}
              </span>
              
              <div className="relative mr-3">
                <button 
                  onClick={(e) => toggleMenu(user.id, e)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
                
                {showMenu === user.id && (
                  <div className="absolute left-0 mt-1 w-40 bg-white shadow-lg rounded-lg z-10 border border-gray-200">
                    <div className="py-1">
                      {user.status !== 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(user.id, 'active');
                            setShowMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          فعال‌سازی
                        </button>
                      )}
                      
                      {user.status !== 'inactive' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(user.id, 'inactive');
                            setShowMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          غیرفعال‌سازی
                        </button>
                      )}
                      
                      {user.status !== 'suspended' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(user.id, 'suspended');
                            setShowMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          تعلیق
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {expandedUser === user.id && (
            <div className="p-4 border-t border-[#462d22]/10 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">تاریخ ایجاد:</span>
                  <span className="mr-1">{formatDate(user.createdAt)}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">آخرین بروزرسانی:</span>
                  <span className="mr-1">{formatDate(user.updatedAt)}</span>
                </div>
                
                {user.lastLogin && (
                  <div>
                    <span className="text-gray-600">آخرین ورود:</span>
                    <span className="mr-1">{formatDate(user.lastLogin)}</span>
                  </div>
                )}
                
                <div className="col-span-1 md:col-span-2 bg-[#fff8f0] p-2 rounded-md border border-[#ffa620]/20 mt-2">
                  <div className="flex items-center">
                    <Key className="h-4 w-4 text-[#ffa620] ml-2" />
                    <span className="text-gray-700 font-medium">کلید API:</span>
                    <div className="flex items-center flex-1">
                      <code className="bg-white px-2 py-1 rounded mx-2 font-mono text-xs overflow-x-auto flex-1 border border-gray-200">
                        {user.apiKey || 'کلید API موجود نیست'}
                      </code>
                      <button
                        onClick={() => {
                          if (user.apiKey) {
                            navigator.clipboard.writeText(user.apiKey);
                            const button = document.getElementById(`copy-btn-${user.id}`);
                            if (button) {
                              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                              setTimeout(() => {
                                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-500"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
                              }, 1000);
                            }
                          }
                        }}
                        id={`copy-btn-${user.id}`}
                        className="p-1 hover:bg-gray-100 rounded-md"
                        title="کپی کلید API"
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-[#462d22]">سیستم‌های RAG</h4>
                <UserRagInfo ragSystems={user.ragSystems} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 