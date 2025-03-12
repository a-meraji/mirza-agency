import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

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

// GET all unique tags from blog posts (public)
export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    
    // Get all tags using MongoDB distinct operation directly on the collection
    const tags = await retryOperation(async () => {
      // Get the model name from the blog model
      const modelName = 'Blog'; // This should match the name used in BlogModel constructor
      // Get the collection
      const collection = mongoose.connection.collection(modelName.toLowerCase());
      // Get distinct tags
      return await collection.distinct('tags');
    });
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blog tags",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 