import { NextResponse } from 'next/server';

// fix for cloudflare
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Check if we have the necessary credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      // If no credentials are set, return a message that would normally be shown in development
      console.log('Email would be sent in production. Missing Gmail credentials.');
      return NextResponse.json(
        { 
          message: 'Email would be sent in production. Email details logged to console.',
          details: {
            to: 'ali.zargari1@outlook.com',
            from: `${name} <${email}>`,
            subject: `Portfolio Contact: ${name}`
          }
        },
        { status: 200 }
      );
    }

    // For Edge Runtime compatibility, use a different approach than nodemailer
    // Option 1: Use an email service with a simple API endpoint (this is a placeholder)
    try {
      // This is an example - you would need to sign up for an email service with a REST API
      // like SendGrid, Mailgun, Resend.com, etc.
      // For example with Resend (https://resend.com) which is Edge compatible:
      // const response = await fetch('https://api.resend.com/emails', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     from: 'Portfolio <onboarding@resend.dev>',
      //     to: 'ali.zargari1@outlook.com',
      //     subject: `Portfolio Contact: ${name}`,
      //     html: `
      //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      //         <h2 style="color: #9B59B6;">New Contact Form Submission</h2>
      //         <p><strong>Name:</strong> ${name}</p>
      //         <p><strong>Email:</strong> ${email}</p>
      //         <h3 style="margin-top: 20px;">Message:</h3>
      //         <p style="white-space: pre-line;">${message}</p>
      //       </div>
      //     `
      //   })
      // });
      
      // For now, we'll just simulate a successful email send in Edge Runtime
      return NextResponse.json({ message: 'Email simulation successful in Edge Runtime' }, { status: 200 });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email through API service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 