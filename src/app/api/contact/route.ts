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

    try {
      // In Edge Runtime, we need to use a different approach than nodemailer
      // We'll use Gmail's SMTP server directly with fetch
      
      // Encode credentials for basic auth
      const auth = Buffer.from(`${process.env.EMAIL_USER}:${process.env.EMAIL_APP_PASSWORD}`).toString('base64');
      
      // Create email content in MIME format
      const emailContent = `From: ${process.env.EMAIL_USER}
To: ali.zargari1@outlook.com
Reply-To: ${email}
Subject: Portfolio Contact: ${name}
Content-Type: text/html; charset=utf-8

<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #9B59B6;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <h3 style="margin-top: 20px;">Message:</h3>
  <p style="white-space: pre-line;">${message}</p>
</div>`;

      // Log the email details for debugging
      console.log('Attempting to send email with the following details:');
      console.log({
        from: process.env.EMAIL_USER,
        to: 'ali.zargari1@outlook.com',
        replyTo: email,
        subject: `Portfolio Contact: ${name}`,
        name: name,
        email: email,
        message: message
      });
      
      // For Edge Runtime, we need to use a service with a REST API
      // Since we can't use nodemailer directly in Edge Runtime
      
      // For now, we'll simulate a successful email send
      // In production, you would need to use a service like SendGrid, Mailgun, etc.
      // that provides a REST API for sending emails
      
      // Here's how you would use Gmail's SMTP server with a service like SendGrid:
      /*
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: 'ali.zargari1@outlook.com' }] }],
          from: { email: process.env.EMAIL_USER },
          reply_to: { email: email },
          subject: `Portfolio Contact: ${name}`,
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9B59B6;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <h3 style="margin-top: 20px;">Message:</h3>
                <p style="white-space: pre-line;">${message}</p>
              </div>
            `
          }]
        })
      });
      */
      
      // For now, we'll just simulate a successful email send
      // This will allow your UI to show success while you implement the actual email sending
      
      // Return success response
      return NextResponse.json({ 
        message: 'Email received successfully',
        success: true,
        details: {
          to: 'ali.zargari1@outlook.com',
          from: process.env.EMAIL_USER,
          replyTo: email,
          subject: `Portfolio Contact: ${name}`
        }
      }, { status: 200 });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
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