import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { getBlogContent } from "@/utils/markdown";
import { marked } from "marked";
import Script from "next/script";

// Define the types
interface Blog {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  ogImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Helper function to get blog data
async function getBlogData(slug: string): Promise<Blog | null> {
  try {
    // Use absolute URL with origin for server components
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

// Generate JSON-LD structured data for the blog post
function generateJsonLd(blog: Blog, domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": blog.ogImage ? [blog.ogImage] : [`https://${domain}/images/blog-default-og.jpg`],
    "datePublished": blog.createdAt || blog.date,
    "dateModified": blog.updatedAt || blog.date,
    "author": {
      "@type": "Organization",
      "name": "Mirza Agency",
      "url": `https://${domain}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mirza Agency",
      "logo": {
        "@type": "ImageObject",
        "url": `https://${domain}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://${domain}/blog/${blog.slug}`
    },
    "keywords": blog.tags?.join(", ")
  };
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  // Safely get the slug
  const slug = params?.slug;
  
  if (!slug) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you're looking for could not be found."
    };
  }
  
  const blog = await getBlogData(slug);
  
  if (!blog) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you're looking for could not be found."
    };
  }
  
  // Get the website domain from environment or use a default
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com';
  
  return {
    title: `${blog.title} | وبلاگ`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://${domain}/blog/${slug}`,
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [`https://${domain}`],
      tags: blog.tags,
      images: blog.ogImage ? [
        {
          url: blog.ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ] : [
        {
          // Default image if no ogImage is provided
          url: `https://${domain}/images/blog-default-og.jpg`,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: blog.ogImage ? [blog.ogImage] : [`https://${domain}/images/blog-default-og.jpg`],
    }
  };
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export default async function BlogDetailPage(
  { params }: PageProps
) {
  // Safely get the slug
  const slug = params?.slug;
  
  if (!slug) {
    notFound();
  }
  
  // Get blog data
  const blog = await getBlogData(slug);
  
  if (!blog) {
    notFound();
  }
  
  // Get the markdown content
  let markdownContent;
  try {
    const { content } = getBlogContent(slug);
    markdownContent = content;
  } catch (error) {
    console.error("Error fetching markdown content:", error);
    markdownContent = "محتوای این مقاله در حال حاضر در دسترس نیست.";
  }
  
  // Convert markdown to HTML
  const htmlContent = marked(markdownContent);
  
  // Get the domain for structured data
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com';
  
  // Generate JSON-LD structured data
  const jsonLd = generateJsonLd(blog, domain);
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      <Script
        id="blog-post-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/blog" 
            className="flex items-center text-[#ffa620] hover:text-[#ffa620]/80 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            بازگشت به وبلاگ
          </Link>
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#462d22] mb-4">{blog.title}</h1>
            
            <div className="flex items-center text-[#462d22]/70 mb-4">
              <div className="flex items-center ml-4">
                <Calendar className="h-4 w-4 ml-1" />
                <span>{formatDate(blog.date)}</span>
              </div>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 ml-1" />
                  <span>{blog.tags.join(", ")}</span>
                </div>
              )}
            </div>
            
            <p className="text-lg text-[#462d22]/80 mb-6">{blog.description}</p>
          </div>
          
          {/* Render markdown content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-[#462d22] prose-p:text-[#462d22]/80 prose-a:text-[#ffa620] prose-a:no-underline hover:prose-a:text-[#ffa620]/80 prose-img:rounded-lg prose-img:mx-auto"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#462d22]/10">
              <h3 className="text-lg font-medium text-[#462d22] mb-2">تگ‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-[#ffa620]/10 text-[#462d22] px-3 py-1 rounded-full text-sm hover:bg-[#ffa620]/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Link 
              href="/blog" 
              className="text-[#ffa620] hover:text-[#ffa620]/80 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              بازگشت به همه مقالات
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 