import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // This should be an app password, not your regular password
      },
    });

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`, // Sender address (your Gmail)
      to: 'ali.zargari1@outlook.com', // Recipient address (your Outlook)
      replyTo: email, // Set reply-to as the form submitter's email
      subject: `Portfolio Contact: ${name}`,
      text: `
From: ${name}
Email: ${email}

Message:
${message}
      `,
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

    // Check if we have the necessary credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      // If no credentials are set, return a message that would normally be shown in development
      console.log('Email would be sent in production. Missing Gmail credentials.');
      return NextResponse.json(
        { 
          message: 'Email would be sent in production. Email details logged to console.',
          details: {
            to: mailOptions.to,
            from: `${name} <${email}>`,
            subject: mailOptions.subject
          }
        },
        { status: 200 }
      );
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 