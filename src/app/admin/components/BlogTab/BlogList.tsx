import { Calendar, FileText, Tag, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Blog } from "../../models/types";

interface BlogListProps {
  blogs: Blog[];
  loading: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

export default function BlogList({ 
  blogs, 
  loading, 
  onEdit, 
  onDelete 
}: BlogListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ffa620]" />
        <p className="mt-2 text-[#462d22]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed bg-gray-50 border-[#462d22]/30 rounded-lg">
        <p className="text-[#462d22]/70">هیچ مقاله‌ای یافت نشد. مقاله جدیدی ایجاد کنید.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="border border-[#462d22]/20 rounded-lg p-4 bg-[#fff6e8ec] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-[#462d22] text-lg">{blog.title}</h3>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-[#ffa620] ml-1" />
                <span className="text-sm text-[#462d22]/70">{blog.date}</span>
              </div>
              <div className="flex items-center mt-1">
                <FileText className="h-4 w-4 text-[#ffa620] ml-1" />
                <span className="text-sm text-[#462d22]/70">{blog.slug}.md</span>
              </div>
              
              <p className="mt-3 text-[#462d22]/80">{blog.description}</p>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center mb-1">
                    <Tag className="h-4 w-4 text-[#ffa620] ml-1" />
                    <span className="text-sm font-medium text-[#462d22]">تگ‌ها:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-[#ffa620]/10 text-[#462d22] text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 md:mt-0 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <Button
                onClick={() => onEdit(blog)}
                className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2 md:ml-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => onDelete(blog.id)}
                className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-[#462d22]/50 flex justify-between">
            <div>ایجاد: {new Date(blog.createdAt).toLocaleDateString('fa-IR')}</div>
            <div>بروزرسانی: {new Date(blog.updatedAt).toLocaleDateString('fa-IR')}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 