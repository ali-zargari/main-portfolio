# Email Setup Instructions

This document explains how to set up the email functionality for the contact forms in your portfolio.

## Overview

The contact forms in this portfolio allow visitors to send you messages directly without opening their email client. The messages are sent using a server-side API.

## Important Note About Resend's Free Tier

Resend has a limitation on their free tier: **you can only send emails to the email address associated with your Resend account**. In this case, that's `alizarg21@gmail.com`.

The current implementation works around this by:
1. Sending the contact form submissions to `alizarg21@gmail.com`
2. Adding a notice in the email to forward it to `ali.zargari1@outlook.com`

To remove this limitation, you have two options:
1. **Verify a domain with Resend** (recommended for production)
2. **Switch to another email provider** like Gmail SMTP

## Configuration Options

You have two options for sending emails:

### Option 1: Resend (Default)

[Resend](https://resend.com) is a modern email API that offers a generous free tier (3,000 emails per month) and excellent deliverability.

1. **Sign up for a Resend account** at [resend.com](https://resend.com)

2. **Get your API key** from the Resend dashboard:
   - After signing up, go to the API Keys section
   - Create a new API key (or use the default one)
   - Copy the API key

3. **Update your environment variables**:
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add the following variable:
     ```
     RESEND_API_KEY=your-resend-api-key
     ```

4. **For production use (to send directly to ali.zargari1@outlook.com)**:
   - Verify a domain with Resend at [resend.com/domains](https://resend.com/domains)
   - Update the `from` address in `src/app/api/contact/route.ts` to use your verified domain
   - Update the `to` address to `ali.zargari1@outlook.com`

### Option 2: Gmail SMTP (Alternative)

If you prefer to use Gmail instead of Resend:

1. **Create a Gmail account** or use an existing one that you want to use for sending emails.

2. **Generate an App Password**:
   - Go to your [Google Account Security settings](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)" - name it "Portfolio Contact Form"
   - Click "Generate" and copy the 16-character password

3. **Update your environment variables**:
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add the following variables:
     ```
     EMAIL_USER=your-gmail@gmail.com
     EMAIL_APP_PASSWORD=your-16-character-app-password
     ```

4. **Update the API code**:
   - Open `src/app/api/contact/route.ts`
   - Comment out the Resend configuration
   - Add the Gmail configuration:
     ```javascript
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_APP_PASSWORD,
       },
     });
     ```

## Testing

To test if your email setup is working:

1. Fill out one of the contact forms on your portfolio
2. Submit the form
3. Check your inbox for the message (either `alizarg21@gmail.com` or your Gmail account)

If you don't receive the email:
- Check your spam folder
- Verify your environment variables are set correctly
- Check the server logs for any error messages

## Troubleshooting

### Resend Issues

- Verify your API key is correct
- Remember that on the free tier, you can only send to your own email address
- To send to other addresses, verify a domain at [resend.com/domains](https://resend.com/domains)
- Check the Resend dashboard for any sending issues or logs

### Gmail Issues

- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Step Verification is enabled on your Google account
- Check if "Less secure app access" is turned on (though App Passwords are preferred)

## Production Deployment

When deploying to production:

1. Add your environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Make sure the variables are properly encrypted and secured
3. Test the contact form after deployment to ensure it works in production
4. If using Resend, consider verifying a domain for better deliverability

## Security Considerations

- Never commit your `.env.local` file to version control
- Regularly rotate your API keys
- Monitor your email sending activity for any unusual patterns
- Consider setting up SPF and DKIM records if using a custom domain with Resend 