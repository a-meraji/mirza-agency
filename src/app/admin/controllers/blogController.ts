import { Blog, BlogFormData } from "../models/types";

export const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await fetch("/api/blogs");
  const data = await res.json();
  return data.blogs || [];
};

export const createBlog = async (formData: BlogFormData, file: File): Promise<Blog> => {
  // First upload the file
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  
  // Add metadata
  const metadata = {
    title: formData.title,
    slug: formData.slug,
    date: formData.date,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    description: formData.description,
    ogImage: formData.ogImage
  };
  
  uploadFormData.append('metadata', JSON.stringify(metadata));
  
  const uploadResponse = await fetch('/api/blogs/upload', {
    method: 'POST',
    body: uploadFormData
  });
  
  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    throw new Error(error.error || 'Failed to upload blog');
  }
  
  // Create blog in database
  const createResponse = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
  
  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.error || 'Failed to create blog in database');
  }
  
  return await createResponse.json();
};

export const updateBlog = async (id: string, formData: BlogFormData): Promise<Blog> => {
  const updateData = {
    id,
    title: formData.title,
    slug: formData.slug,
    date: formData.date,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    description: formData.description,
    ogImage: formData.ogImage
  };
  
  const updateResponse = await fetch('/api/blogs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    throw new Error(error.error || 'Failed to update blog');
  }
  
  return await updateResponse.json();
};

export const deleteBlog = async (id: string): Promise<void> => {
  const response = await fetch(`/api/blogs?id=${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete blog');
  }
}; 