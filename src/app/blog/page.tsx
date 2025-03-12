"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Search, Tag, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { debounce } from "lodash";

// Define Blog interface
interface Blog {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
}

// Define Pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function BlogIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current query parameters
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  
  // State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: currentPage,
    limit: 10,
    pages: 0
  });
  
  // Fetch blogs with current filters
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (currentSearch) params.append("search", currentSearch);
      if (currentTag) params.append("tag", currentTag);
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      
      // Fetch blogs
      const response = await fetch(`/api/blogs?${params.toString()}`);
      const data = await response.json();
      
      if (data.blogs) {
        setBlogs(data.blogs);
        setPagination(data.pagination || {
          total: data.blogs.length,
          page: currentPage,
          limit: 10,
          pages: Math.ceil(data.blogs.length / 10)
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentSearch, currentTag, currentPage]);
  
  // Fetch all tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/blogs/tags");
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);
  
  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, [fetchBlogs, fetchTags]);
  
  // Update URL with new search parameters
  const updateSearchParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Always reset to page 1 when filters change, unless changing page
    if (!params.hasOwnProperty("page")) {
      newParams.set("page", "1");
    }
    
    // Update URL
    router.push(`/blog?${newParams.toString()}`);
  }, [router, searchParams]);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateSearchParams({ search: value, page: "1" });
    }, 500),
    [updateSearchParams]
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Handle tag selection
  const handleTagClick = (tag: string) => {
    updateSearchParams({ tag: tag === currentTag ? "" : tag });
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      updateSearchParams({ page: newPage.toString() });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#462d22] mb-4">وبلاگ</h1>
        <p className="text-[#462d22]/70 max-w-2xl mx-auto">
          آخرین مطالب، نکات و مقالات ما را در اینجا ببینید
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="جستجو در مقالات..."
                className="w-full p-3 pr-10 border border-[#462d22]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#462d22]/40 h-5 w-5" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-[#462d22] mb-3">تگ ها</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentTag === tag
                      ? "bg-[#ffa620] text-white"
                      : "bg-[#ffa620]/10 text-[#462d22] hover:bg-[#ffa620]/20"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {currentTag || currentSearch ? (
            <div className="mb-6">
              <h3 className="text-xl font-medium text-[#462d22] mb-3">فیلترهای فعال</h3>
              <div className="flex flex-wrap gap-2">
                {currentSearch && (
                  <div className="flex items-center bg-[#ffa620]/10 px-3 py-1 rounded-full text-sm text-[#462d22]">
                    <span className="ml-1">جستجو:</span>
                    <span>{currentSearch}</span>
                    <button
                      onClick={() => updateSearchParams({ search: "" })}
                      className="mr-1 text-[#462d22]/60 hover:text-[#462d22]"
                    >
                      &times;
                    </button>
                  </div>
                )}
                {currentTag && (
                  <div className="flex items-center bg-[#ffa620]/10 px-3 py-1 rounded-full text-sm text-[#462d22]">
                    <span className="ml-1">تگ:</span>
                    <span>{currentTag}</span>
                    <button
                      onClick={() => updateSearchParams({ tag: "" })}
                      className="mr-1 text-[#462d22]/60 hover:text-[#462d22]"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  updateSearchParams({ search: "", tag: "" });
                  setSearchTerm("");
                }}
                className="mt-2 text-sm text-[#ffa620] hover:text-[#ffa620]/80"
              >
                پاک کردن همه فیلترها
              </button>
            </div>
          ) : null}
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-[#ffa620]" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#462d22]/20 rounded-lg">
              <h3 className="text-xl font-medium text-[#462d22] mb-2">هیچ مقاله‌ای یافت نشد</h3>
              <p className="text-[#462d22]/70">
                مقاله‌ای با معیارهای جستجوی شما پیدا نشد. لطفاً فیلترهای خود را تغییر دهید.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-[#462d22]/70">
                <span className="font-medium">{pagination.total}</span> مقاله یافت شد
              </div>
              
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="block bg-white border border-[#462d22]/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-[#462d22] mb-2 hover:text-[#ffa620] transition-colors">
                        {blog.title}
                      </h2>
                      
                      <div className="flex items-center text-sm text-[#462d22]/70 mb-3">
                        <div className="flex items-center ml-4">
                          <Calendar className="h-4 w-4 ml-1" />
                          <span>{formatDate(blog.date)}</span>
                        </div>
                        
                        {blog.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 ml-1" />
                            <span>{blog.tags.slice(0, 3).join(", ")}</span>
                            {blog.tags.length > 3 && <span> و {blog.tags.length - 3} تگ دیگر</span>}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-[#462d22]/80">
                        {blog.description.length > 200
                          ? `${blog.description.substring(0, 200)}...`
                          : blog.description}
                      </p>
                      
                      <div className="mt-4 text-[#ffa620] font-medium text-sm">مطالعه بیشتر &larr;</div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "text-[#462d22]/30 cursor-not-allowed"
                          : "text-[#462d22] hover:bg-[#ffa620]/10"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.pages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, i, arr) => {
                        // Add ellipsis if there are gaps
                        const prevPage = arr[i - 1];
                        const showEllipsisBefore = prevPage && page - prevPage > 1;
                        
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsisBefore && (
                              <span className="px-3 py-1 text-[#462d22]/50">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === page
                                  ? "bg-[#ffa620] text-white"
                                  : "text-[#462d22] hover:bg-[#ffa620]/10"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className={`p-2 rounded-md ${
                        currentPage === pagination.pages
                          ? "text-[#462d22]/30 cursor-not-allowed"
                          : "text-[#462d22] hover:bg-[#ffa620]/10"
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 