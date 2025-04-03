import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
});

// In-memory store to track emails sent
// For production, use a database instead
const emailTracker = new Map<string, boolean>();

// Get a unique identifier for the user (IP address or user ID)
async function getUserIdentifier(request: Request): Promise<string> {
  // In a real app, you would use a logged-in user's ID
  // For this example, we'll use IP address as a fallback
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { to, subject, message } = body;
    
    // Get user identifier
    const userId = await getUserIdentifier(request);

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this user has already sent an email
    if (emailTracker.has(userId)) {
      return NextResponse.json(
        { message: 'You have already submitted your feature request', 
          alreadySent: true 
        },
        { status: 403 }
      );
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p style="margin-top: 20px; color: #666;">Sent via Birthday Card App</p>
      </div>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Record that this user has sent an email
    emailTracker.set(userId, true);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
}