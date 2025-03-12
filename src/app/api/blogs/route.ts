import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

// Cache configuration for public routes
export const revalidate = 3600; // Revalidate cache every hour (3600 seconds)

// Helper function to retry database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  delay = 1000
): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Make sure database connection is established before each attempt
      await connectToDatabase();

      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Increase delay for next retry (exponential backoff)
        delay *= 2;
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
}

// GET all blogs (public)
export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build the query for filtering
    const where: any = {};
    
    // Add search filter if provided
    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add tag filter if provided
    if (tag) {
      where.tags = { $in: [tag] };
    }
    
    // Fetch blogs with pagination and filters
    const blogs = await retryOperation(() =>
      db.blog.findMany({
        where,
        orderBy: { date: 'desc' },
        limit,
        skip,
      })
    );
    
    // Get total count for pagination using mongoose connection directly
    const total = await retryOperation(async () => {
      const collection = mongoose.connection.collection('blogs');
      return await collection.countDocuments(where);
    });
    
    // Return response with cache headers
    return new NextResponse(JSON.stringify({
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST to create a new blog (admin only)
export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
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
    
    // Parse request body
    const { title, slug, date, tags, description } = await req.json();
    
    // Validate required fields
    if (!title || !slug || !date || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingBlog = await retryOperation(() =>
      db.blog.findUnique({
        where: { slug }
      })
    );
    
    if (existingBlog) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }
    
    // Create new blog post
    const blog = await retryOperation(() =>
      db.blog.create({
        data: {
          title,
          slug,
          date,
          tags: Array.isArray(tags) ? tags : [],
          description
        }
      })
    );
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        error: "Failed to create blog",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT to update a blog (admin only)
export async function PUT(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
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
    
    // Parse request body
    const { id, title, slug, date, tags, description } = await req.json();
    
    // Validate required fields
    if (!id || !title || !slug || !date || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if blog exists
    const existingBlog = await retryOperation(() =>
      db.blog.findById({ id })
    );
    
    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    // Check if slug is being changed and if new slug already exists
    if (slug !== existingBlog.slug) {
      const slugExists = await retryOperation(() =>
        db.blog.findUnique({
          where: { slug }
        })
      );
      
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }
    
    // Update blog
    const updatedBlog = await retryOperation(() =>
      db.blog.update({
        id,
        data: {
          title,
          slug,
          date,
          tags: Array.isArray(tags) ? tags : [],
          description
        }
      })
    );
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        error: "Failed to update blog",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE to remove a blog (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
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
    
    // Get blog ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }
    
    // Check if blog exists
    const existingBlog = await retryOperation(() =>
      db.blog.findById({ id })
    );
    
    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    // Delete blog
    await retryOperation(() =>
      db.blog.delete({
        id
      })
    );
    
    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        error: "Failed to delete blog",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 