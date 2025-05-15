import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function sortBlogPostsByDate(posts: any[]) {
  return posts.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) {
      return -1;
    }
    return 1;
  });
}

export function filterPublishedPosts(posts: any[]) {
  return posts.filter((post) => post.published !== false);
}

export function getTagsFromPosts(posts: any[]) {
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    if (!post.tags) return;
    post.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });
  
  return Array.from(tags);
} 