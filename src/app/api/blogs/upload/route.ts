import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import matter from "gray-matter";

// Constants
const BLOG_CONTENT_DIR = path.join(process.cwd(), "src/content/blogs");

/**
 * API route for uploading markdown files
 * Requires admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }
    
    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const metadataStr = formData.get("metadata") as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    
    if (!metadataStr) {
      return NextResponse.json(
        { error: "No metadata provided" },
        { status: 400 }
      );
    }
    
    // Parse metadata
    const metadata = JSON.parse(metadataStr);
    
    // Validate required metadata
    if (!metadata.title || !metadata.slug || !metadata.date || !metadata.description) {
      return NextResponse.json(
        { error: "Missing required metadata fields" },
        { status: 400 }
      );
    }
    
    // Ensure the file is a markdown file
    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: "Only Markdown (.md) files are allowed" },
        { status: 400 }
      );
    }
    
    // Create the blogs directory if it doesn't exist
    if (!existsSync(BLOG_CONTENT_DIR)) {
      await mkdir(BLOG_CONTENT_DIR, { recursive: true });
    }
    
    // Get the file content as buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create frontmatter content
    const frontmatter = {
      title: metadata.title,
      slug: metadata.slug,
      date: metadata.date,
      tags: metadata.tags,
      description: metadata.description,
      ogImage: metadata.ogImage
    };
    
    // Extract the content part from the uploaded file
    let fileContent = buffer.toString();
    
    // Check if the file already has frontmatter
    const parsedContent = matter(fileContent);
    
    if (Object.keys(parsedContent.data).length > 0) {
      // If it has frontmatter, we'll preserve just the content
      fileContent = parsedContent.content;
    }
    
    // Create new content with frontmatter
    const newContent = matter.stringify(fileContent, frontmatter);
    
    // Save the file
    const filePath = path.join(BLOG_CONTENT_DIR, `${metadata.slug}.md`);
    await writeFile(filePath, newContent);
    
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/content/blogs/${metadata.slug}.md`
    });
  } catch (error) {
    console.error("Error uploading blog file:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 