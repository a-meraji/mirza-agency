import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { google } from "googleapis";

// Helper function to initialize Google Calendar API
async function getGoogleCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// GET available time slots
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const calendar = await getGoogleCalendarClient(session.accessToken as string);
    
    // Get the next 7 days
    const now = new Date();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(now.getDate() + 7);
    
    // Get busy times from calendar
    const busyTimes = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: oneWeekLater.toISOString(),
        items: [{ id: 'primary' }],
      },
    });
    
    // Generate available time slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    const busyTimeRanges = busyTimes.data.calendars?.primary?.busy || [];
    
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() + d);
      
      // Set to 9 AM
      date.setHours(9, 0, 0, 0);
      
      for (let hour = 9; hour < 17; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1);
        
        // Check if slot overlaps with any busy time
        const isOverlapping = busyTimeRanges.some(busyTime => {
          const busyStart = new Date(busyTime.start);
          const busyEnd = new Date(busyTime.end);
          
          return (
            (slotStart >= busyStart && slotStart < busyEnd) ||
            (slotEnd > busyStart && slotEnd <= busyEnd) ||
            (slotStart <= busyStart && slotEnd >= busyEnd)
          );
        });
        
        if (!isOverlapping) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          });
        }
      }
    }
    
    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}

// POST to create a new event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { start, end, name, email, phone, description, selectedServices } = await req.json();
    
    if (!start || !end || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const calendar = await getGoogleCalendarClient(session.accessToken as string);
    
    // Create the event
    const event = {
      summary: `Meeting with ${name}`,
      description: `
        Services: ${selectedServices.join(", ")}
        Contact: ${email} | ${phone || "No phone provided"}
        Details: ${description || "No additional details"}
      `,
      start: {
        dateTime: start,
        timeZone: 'Asia/Tehran',
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Tehran',
      },
      attendees: [
        { email },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };
    
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });
    
    return NextResponse.json({ 
      success: true, 
      eventId: createdEvent.data.id,
      eventLink: createdEvent.data.htmlLink
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
} 