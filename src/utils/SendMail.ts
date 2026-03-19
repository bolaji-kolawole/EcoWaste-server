import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com or mail.yourdomain.com
  port: parseInt(process.env.SMTP_PORT || '587'), // 465 for SSL, 587 for TLS
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});


export async function sendCodeMail(
  email: string,
  code: string,
  action: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `${process.env.SERVICE_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject: action,
      html: `
        <div style="font-family: Arial;">
          <h2>${action}</h2>
          <p>Your verification code is:</p>
          <h1>${code}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Failed to send email");
  }
}

