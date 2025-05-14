import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access this resource",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get time range parameters (default to last 30 days)
    const searchParams = req.nextUrl.searchParams;
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    
    const to = toParam ? new Date(toParam) : new Date();
    const from = fromParam ? new Date(fromParam) : new Date(to);
    from.setDate(from.getDate() - 30); // Default to 30 days ago if not specified
    
    // Get user usage data
    const usage = await db.usage.findMany({
      where: {
        user: userId,
        createdAt: {
          $gte: from,
          $lte: to
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    // Calculate totals
    const totalInputTokens = usage.reduce((sum, item) => sum + (item.inputTokens || 0), 0);
    const totalOutputTokens = usage.reduce((sum, item) => sum + (item.outputTokens || 0), 0);
    const totalCost = usage.reduce((sum, item) => sum + (item.cost || 0), 0);
    
    // Group by day for chart data
    const dailyUsage = usage.reduce((acc, item) => {
      const day = new Date(item.createdAt).toISOString().split('T')[0];
      
      if (!acc[day]) {
        acc[day] = {
          date: day,
          inputTokens: 0,
          outputTokens: 0,
          cost: 0,
          count: 0
        };
      }
      
      acc[day].inputTokens += item.inputTokens || 0;
      acc[day].outputTokens += item.outputTokens || 0;
      acc[day].cost += item.cost || 0;
      acc[day].count += 1;
      
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json({
      usage,
      summary: {
        totalInputTokens,
        totalOutputTokens,
        totalCost,
        count: usage.length
      },
      dailyUsage: Object.values(dailyUsage)
    });
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch usage data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 