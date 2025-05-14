import { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/UI/button";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import { Blog, BlogFormData } from "../../models/types";
import { 
  fetchBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from "../../controllers/blogController";

export default function BlogTab() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to fetch blogs'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleCreateBlog = async (formData: BlogFormData, file: File | null) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadMessage("");
      
      const newBlog = await createBlog(formData, file);
      
      // Add the new blog to the state
      setBlogs(prev => [newBlog, ...prev]);
      
      setShowForm(false);
      setUploadMessage("Blog post created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create blog'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateBlog = async (formData: BlogFormData, file: File | null) => {
    if (!editingBlog) return;
    
    try {
      setIsUploading(true);
      
      const updatedBlog = await updateBlog(editingBlog.id, formData);
      
      // Update the blog in the state
      setBlogs(prev => prev.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      ));
      
      setShowForm(false);
      setEditingBlog(null);
      setUploadMessage("Blog post updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to update blog'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }
    
    try {
      await deleteBlog(id);
      
      // Remove the blog from the state
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      setUploadMessage("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to delete blog'}`);
    }
  };

  const startEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: BlogFormData, file: File | null) => {
    if (editingBlog) {
      handleUpdateBlog(formData, file);
    } else {
      handleCreateBlog(formData, file);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#462d22]">مدیریت مقالات وبلاگ</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={loadBlogs}
            className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={() => {
              setShowForm(true);
              setEditingBlog(null);
            }}
            className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن مقاله جدید
          </Button>
        </div>
      </div>
      
      {uploadMessage && (
        <div className={`mb-4 p-3 rounded-lg ${
          uploadMessage.includes('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {uploadMessage}
        </div>
      )}
      
      {showForm && (
        <BlogForm 
          editingBlog={editingBlog}
          onSubmit={handleFormSubmit}
          onCancel={cancelForm}
          isUploading={isUploading}
        />
      )}
      
      <BlogList 
        blogs={blogs}
        loading={loading}
        onEdit={startEditBlog}
        onDelete={handleDeleteBlog}
      />
    </>
  );
} 