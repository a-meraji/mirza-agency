import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";

// Cache configuration
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

// GET a single blog by slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
    // Get slug from params
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    
    // Find blog by slug
    const blog = await retryOperation(() =>
      db.blog.findUnique({
        where: { slug }
      })
    );
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    // Return response with cache headers
    return new NextResponse(JSON.stringify(blog), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blog",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 