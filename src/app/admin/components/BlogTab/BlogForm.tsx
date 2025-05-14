import { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import { Loader2 } from "lucide-react";
import { Blog, BlogFormData } from "../../models/types";

interface BlogFormProps {
  editingBlog: Blog | null;
  onSubmit: (formData: BlogFormData, file: File | null) => void;
  onCancel: () => void;
  isUploading: boolean;
}

export default function BlogForm({
  editingBlog,
  onSubmit,
  onCancel,
  isUploading
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    date: new Date().toISOString().split('T')[0],
    tags: "",
    description: "",
    ogImage: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title,
        slug: editingBlog.slug,
        date: editingBlog.date,
        tags: editingBlog.tags.join(', '),
        description: editingBlog.description,
        ogImage: editingBlog.ogImage || ''
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        date: new Date().toISOString().split('T')[0],
        tags: "",
        description: "",
        ogImage: ""
      });
      setSelectedFile(null);
    }
  }, [editingBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.md')) {
        setSelectedFile(file);
        setUploadMessage("");
        
        // Extract slug from filename
        const slug = file.name.replace('.md', '');
        
        // Update the form data with the slug
        setFormData(prev => ({
          ...prev,
          slug
        }));
      } else {
        setSelectedFile(null);
        setUploadMessage("Please select a Markdown (.md) file");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for non-edit mode
    if (!editingBlog && !selectedFile) {
      setUploadMessage("Please select a Markdown (.md) file");
      return;
    }
    
    onSubmit(formData, selectedFile);
  };

  return (
    <div className="mb-6 p-4 border bg-gray-50 border-[#462d22]/20 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-[#462d22]">
        {editingBlog ? "ویرایش مقاله" : "افزودن مقاله جدید"}
      </h3>
      
      {uploadMessage && (
        <div className={`mb-4 p-3 rounded-lg ${
          uploadMessage.includes('Please') 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {uploadMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#462d22] mb-1">عنوان</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-[#462d22] mb-1">اسلاگ (URL)</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
          </div>
          
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
            <label htmlFor="tags" className="block text-sm font-medium text-[#462d22] mb-1">تگ‌ها (با کاما جدا کنید)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              placeholder="react, next.js, mongodb"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-[#462d22] mb-1">توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="ogImage" className="block text-sm font-medium text-[#462d22] mb-1">تصویر Open Graph (URL)</label>
            <input
              type="text"
              id="ogImage"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleInputChange}
              placeholder="https://example.com/images/my-og-image.jpg"
              className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">تصویری برای اشتراک‌گذاری در شبکه‌های اجتماعی (اندازه پیشنهادی: 1200×630 پیکسل)</p>
          </div>
          
          {!editingBlog && (
            <div className="md:col-span-2">
              <label htmlFor="mdFile" className="block text-sm font-medium text-[#462d22] mb-1">فایل Markdown (.md)</label>
              <input
                type="file"
                id="mdFile"
                onChange={handleFileChange}
                accept=".md"
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">فقط فایل‌های با پسوند .md پذیرفته می‌شوند</p>
            </div>
          )}
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
            disabled={isUploading || (!editingBlog && !selectedFile)}
            className={`${
              isUploading || (!editingBlog && !selectedFile)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#fbeee0] border-2 border-[#422800] shadow-[4px_4px_0_0_#422800] hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]'
            } rounded-[30px] text-[#422800] font-semibold px-4 py-2 text-center no-underline select-none`}
          >
            {isUploading ? (
              <>
                <Loader2 className="inline h-4 w-4 animate-spin ml-2" />
                در حال بارگذاری...
              </>
            ) : (
              editingBlog ? "بروزرسانی" : "ایجاد"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}