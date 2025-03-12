import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";
import axios from "axios";
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

// Helper function to send booking notifications to Telegram
async function sendTelegramNotification(booking: any, appointment: any) {
  // Maximum number of retry attempts
  const maxRetries = 1;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.error("Telegram bot token or chat ID is missing");
        return;
      }

      // Format date and time for display
      const appointmentDate = new Date(appointment.date);
      const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Create a nicely formatted message with emoji for visual appeal
      const message = `
🔔 *New Booking Received!* 🔔

👤 *Client:* ${booking.name}
📧 *Email:* ${booking.email}
📱 *Phone:* ${booking.phone || "Not provided"}

📅 *Appointment:* ${formattedDate}
⏰ *Time:* ${formattedTime}

✅ *Services:* ${
        Array.isArray(booking.selectedServices)
          ? booking.selectedServices.join(", ")
          : booking.selectedServices || "Not specified"
      }

📝 *Notes:* ${booking.notes || "None"}

🆔 *Booking ID:* \`${booking.id}\`
      `;

      
      // Send the message to Telegram using their Bot API with native https
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const data = {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      };
      console.log(
        `${url}-Attempting to send Telegram notification (attempt ${attempt}/${maxRetries})`
      );

      const result = await axios.post(url, data);
      console.log("Telegram notification sent successfully");
      if (result.status === 200) return; // Success, exit the function
    } catch (error: any) {
      console.error(
        `Error sending Telegram notification (attempt ${attempt}/${maxRetries}):`,
        error
      );

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delayMs = 2000 * attempt; // Increasing delay with each retry
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  console.error("Failed to send Telegram notification after multiple attempts");
}

// GET all bookings (admin only)
export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();

    // Get session with retry
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      console.error("Error getting session:", error);
      return NextResponse.json(
        {
          error: "Authentication error",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 401 }
      );
    }

    // Check if user is authenticated
    if (!session) {
      console.log("Authentication failed: No session found");
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access this resource",
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      console.log(
        `User ${session.user.email} attempted to access admin-only endpoint with role: ${session.user.role}`
      );
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const bookings = await retryOperation(() =>
      db.booking.findMany({
        include: {
          availableAppointment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST to create a new booking
export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();

    const { appointmentId, name, email, phone, notes, selectedServices } =
      await req.json();

    if (!appointmentId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if appointment exists and is not already booked
    try {
      console.log(`Looking up appointment with ID: ${appointmentId}`);

      // Use findById directly instead of findUnique for more reliability
      const appointment = await retryOperation(() =>
        db.availableAppointment.findById({ id: appointmentId })
      );

      if (!appointment) {
        console.error(`Appointment with ID ${appointmentId} not found`);
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 }
        );
      }

      console.log(`Found appointment:`, JSON.stringify(appointment, null, 2));

      if (appointment.isBooked) {
        return NextResponse.json(
          { error: "Appointment is already booked" },
          { status: 400 }
        );
      }

      // Create booking and update appointment in a transaction
      console.log(`Starting transaction to book appointment ${appointment.id}`);
      try {
        const bookingData = {
          name,
          email,
          phone,
          notes,
          selectedServices,
          appointmentId: appointment.id, // Use the confirmed ID from the found appointment
        };

        console.log(
          `Creating booking with data:`,
          JSON.stringify(bookingData, null, 2)
        );

        const result = await retryOperation(() =>
          db.$transaction([
            db.booking.create({
              data: bookingData as any, // Type assertion to fix the type error
            }),
            db.availableAppointment.update({
              id: appointment.id, // Use the id format that works with the model
              data: { isBooked: true },
            }),
          ])
        );

        console.log(`Transaction completed successfully`);

        // Send notification to Telegram after successful booking
        await sendTelegramNotification(result[0], result[1]);

        return NextResponse.json({
          success: true,
          booking: result[0],
          appointment: result[1],
        });
      } catch (error) {
        console.error(`Error during booking transaction:`, error);
        return NextResponse.json(
          {
            error: `Error creating booking: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(`Error looking up appointment:`, error);
      return NextResponse.json(
        {
          error: `Error looking up appointment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error looking up appointment:`, error);
    return NextResponse.json(
      {
        error: `Error looking up appointment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
