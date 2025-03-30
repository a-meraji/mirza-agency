"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  // Get current query parameters
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Translations
  const translations: Record<string, Record<string, string>> = {
    en: {
      blog: "Blog",
      blogSubtitle: "Check out our latest articles, tips, and insights",
      search: "Search articles...",
      tags: "Tags",
      activeFilters: "Active Filters",
      searchLabel: "Search:",
      tagLabel: "Tag:",
      clearAllFilters: "Clear all filters",
      noArticlesFound: "No articles found",
      noArticlesFoundMessage: "No articles match your search criteria. Please try different filters.",
      articlesFound: "articles found",
      readMore: "Read more",
      andMore: "and",
      moreTag: "more",
    },
    fa: {
      blog: "وبلاگ",
      blogSubtitle: "آخرین مطالب، نکات و مقالات ما را در اینجا ببینید",
      search: "جستجو در مقالات...",
      tags: "تگ ها",
      activeFilters: "فیلترهای فعال",
      searchLabel: "جستجو:",
      tagLabel: "تگ:",
      clearAllFilters: "پاک کردن همه فیلترها",
      noArticlesFound: "هیچ مقاله‌ای یافت نشد",
      noArticlesFoundMessage: "مقاله‌ای با معیارهای جستجوی شما پیدا نشد. لطفاً فیلترهای خود را تغییر دهید.",
      articlesFound: "مقاله یافت شد",
      readMore: "مطالعه بیشتر",
      andMore: "و",
      moreTag: "تگ دیگر",
    }
  };

  const t = (key: string) => {
    if (!translations[lang as 'en' | 'fa'] || !translations[lang as 'en' | 'fa'][key]) {
      return key;
    }
    return translations[lang as 'en' | 'fa'][key];
  };
  
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
      params.append("lang", lang); // Add language filter
      
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
  }, [currentSearch, currentTag, currentPage, lang]);
  
  // Fetch all tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(`/api/blogs/tags?lang=${lang}`);
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [lang]);
  
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
    router.push(`/${lang}/blog?${newParams.toString()}`);
  }, [router, searchParams, lang]);
  
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
    return date.toLocaleDateString(lang === 'fa' ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Determine text direction and font classes
  const isRTL = lang === 'fa';
  const fontClass = lang === 'fa' ? "font-iransans" : "font-roboto";
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className={`text-4xl font-bold text-[#462d22] mb-4 ${fontClass}`}>{t('blog')}</h1>
        <p className={`text-[#462d22]/70 max-w-2xl mx-auto ${fontClass}`}>
          {t('blogSubtitle')}
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
                placeholder={t('search')}
                className={`w-full p-3 ${isRTL ? 'pr-10' : 'pl-10'} border border-[#462d22]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent ${fontClass}`}
              />
              <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-[#462d22]/40 h-5 w-5`} />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className={`text-xl font-medium text-[#462d22] mb-3 ${fontClass}`}>{t('tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${fontClass} ${
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
              <h3 className={`text-xl font-medium text-[#462d22] mb-3 ${fontClass}`}>{t('activeFilters')}</h3>
              <div className="flex flex-wrap gap-2">
                {currentSearch && (
                  <div className={`flex items-center bg-[#ffa620]/10 px-3 py-1 rounded-full text-sm text-[#462d22] ${fontClass}`}>
                    <span className={isRTL ? "ml-1" : "mr-1"}>{t('searchLabel')}</span>
                    <span>{currentSearch}</span>
                    <button
                      onClick={() => updateSearchParams({ search: "" })}
                      className={`${isRTL ? "mr-1" : "ml-1"} text-[#462d22]/60 hover:text-[#462d22]`}
                    >
                      &times;
                    </button>
                  </div>
                )}
                {currentTag && (
                  <div className={`flex items-center bg-[#ffa620]/10 px-3 py-1 rounded-full text-sm text-[#462d22] ${fontClass}`}>
                    <span className={isRTL ? "ml-1" : "mr-1"}>{t('tagLabel')}</span>
                    <span>{currentTag}</span>
                    <button
                      onClick={() => updateSearchParams({ tag: "" })}
                      className={`${isRTL ? "mr-1" : "ml-1"} text-[#462d22]/60 hover:text-[#462d22]`}
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
                className={`mt-2 text-sm text-[#ffa620] hover:text-[#ffa620]/80 ${fontClass}`}
              >
                {t('clearAllFilters')}
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
              <h3 className={`text-xl font-medium text-[#462d22] mb-2 ${fontClass}`}>{t('noArticlesFound')}</h3>
              <p className={`text-[#462d22]/70 ${fontClass}`}>
                {t('noArticlesFoundMessage')}
              </p>
            </div>
          ) : (
            <>
              <div className={`mb-4 text-[#462d22]/70 ${fontClass}`}>
                <span className="font-medium">{pagination.total}</span> {t('articlesFound')}
              </div>
              
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/${lang}/blog/${blog.slug}`}
                    className="block bg-white border border-[#462d22]/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <h2 className={`text-2xl font-bold text-[#462d22] mb-2 hover:text-[#ffa620] transition-colors ${fontClass}`}>
                        {blog.title}
                      </h2>
                      
                      <div className={`flex items-center text-sm text-[#462d22]/70 mb-3 ${fontClass}`}>
                        <div className={`flex items-center ${isRTL ? "ml-4" : "mr-4"}`}>
                          <Calendar className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                          <span>{formatDate(blog.date)}</span>
                        </div>
                        
                        {blog.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                            <span>{blog.tags.slice(0, 3).join(", ")}</span>
                            {blog.tags.length > 3 && <span> {t('andMore')} {blog.tags.length - 3} {t('moreTag')}</span>}
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-[#462d22]/80 ${fontClass}`}>
                        {blog.description.length > 200
                          ? `${blog.description.substring(0, 200)}...`
                          : blog.description}
                      </p>
                      
                      <div className={`mt-4 text-[#ffa620] font-medium text-sm ${fontClass}`}>
                        {t('readMore')} {isRTL ? "←" : "→"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className={`flex items-center ${isRTL ? "space-x-2 space-x-reverse" : "space-x-2"}`}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "text-[#462d22]/30 cursor-not-allowed"
                          : "text-[#462d22] hover:bg-[#ffa620]/10"
                      }`}
                    >
                      {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
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
                              className={`px-3 py-1 rounded-md ${fontClass} ${
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
                      {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#ffa620]" />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
} 