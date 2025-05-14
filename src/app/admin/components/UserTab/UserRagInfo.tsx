import { useState } from "react";
import { ChevronDown, ChevronUp, Database, Server, FileText } from "lucide-react";
import { RAGSystem } from "../../models/types";

interface UserRagInfoProps {
  ragSystems: RAGSystem[];
}

export default function UserRagInfo({ ragSystems }: UserRagInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!ragSystems || ragSystems.length === 0) {
    return (
      <div className="mt-2 text-sm text-gray-500 italic">
        بدون سیستم RAG
      </div>
    );
  }
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };
  
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeTranslation = (type: string): string => {
    switch(type) {
      case 'technical':
        return 'فنی';
      case 'management':
        return 'مدیریتی';
      case 'customer-service':
        return 'خدمات مشتری';
      case 'educational':
        return 'آموزشی';
      case 'data-analysis':
        return 'تحلیل داده';
      default:
        return type;
    }
  };
  
  const getStatusTranslation = (status: string): string => {
    switch(status) {
      case 'active':
        return 'فعال';
      case 'inactive':
        return 'غیرفعال';
      case 'pending':
        return 'در انتظار';
      default:
        return status;
    }
  };
  
  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm font-medium text-[#462d22] hover:text-[#ffa620]"
      >
        <span className="ml-1">سیستم‌های RAG ({ragSystems.length})</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {ragSystems.map((ragSystem) => (
            <div 
              key={ragSystem.id} 
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-[#462d22]">{ragSystem.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ragSystem.status)}`}>
                  {getStatusTranslation(ragSystem.status)}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Server className="h-4 w-4 text-[#ffa620] ml-1" />
                  <span className="text-gray-600">نوع:</span>
                  <span className="mr-1">{getTypeTranslation(ragSystem.type)}</span>
                </div>
                
                {ragSystem.modelType && (
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-[#ffa620] ml-1" />
                    <span className="text-gray-600">مدل:</span>
                    <span className="mr-1">{ragSystem.modelType}</span>
                  </div>
                )}
                
                {ragSystem.documentCount && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-[#ffa620] ml-1" />
                    <span className="text-gray-600">تعداد اسناد:</span>
                    <span className="mr-1">{ragSystem.documentCount.toLocaleString()}</span>
                  </div>
                )}
                
                {ragSystem.storageSize && (
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-[#ffa620] ml-1" />
                    <span className="text-gray-600">حجم ذخیره‌سازی:</span>
                    <span className="mr-1">{ragSystem.storageSize} MB</span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>ایجاد: {formatDate(ragSystem.createdAt)}</span>
                <span>بروزرسانی: {formatDate(ragSystem.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 