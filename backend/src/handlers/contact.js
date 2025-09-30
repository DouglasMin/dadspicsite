import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { success, badRequest, internalError } from '../utils/response.js';

const ses = new SESClient({ region: process.env.AWS_REGION || 'ap-northeast-2' });

// Configure your email addresses
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com';
const TO_EMAIL = process.env.TO_EMAIL || 'admin@example.com';

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  if (event.httpMethod !== 'POST') {
    return badRequest('Only POST method is supported');
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return badRequest('Missing required fields: name, email, subject, message');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return badRequest('Invalid email format');
    }

    // Send email using SES
    const emailParams = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [TO_EMAIL],
      },
      Message: {
        Subject: {
          Data: `[Gallery Contact Form] ${data.subject}`,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
            `.trim(),
            Charset: 'UTF-8',
          },
          Html: {
            Data: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <hr>
  <p><strong>Message:</strong></p>
  <p>${data.message.replace(/\n/g, '<br>')}</p>
</body>
</html>
            `.trim(),
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: [data.email],
    };

    const command = new SendEmailCommand(emailParams);
    await ses.send(command);

    return success({
      message: 'Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Check if it's an SES-specific error
    if (error.name === 'MessageRejected' || error.name === 'MailFromDomainNotVerifiedException') {
      return internalError('Email service not configured. Please contact the administrator.');
    }

    return internalError(error.message);
  }
};