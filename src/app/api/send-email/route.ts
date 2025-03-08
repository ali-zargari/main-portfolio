import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Use Node.js runtime instead of Edge
export const runtime = 'nodejs';

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
      // Create a nodemailer transporter with Gmail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ali.zargari1@outlook.com',
        replyTo: email,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #9B59B6;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <h3 style="margin-top: 20px;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        `,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent successfully:', info.messageId);
      
      // Return success response
      return NextResponse.json({ 
        message: 'Email sent successfully',
        messageId: info.messageId,
        success: true
      }, { status: 200 });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 