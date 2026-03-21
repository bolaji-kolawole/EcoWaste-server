import nodemailer from 'nodemailer';
import { createSigner } from "fast-jwt";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

// Optional: verify once at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to take messages");
  }
});

const signer = createSigner({ key: process.env.NEST_JWT_TOKEN, expiresIn: "2 days" });

export async function createWelcomeLink(email: string): Promise<void> {
  const token = signer({ email });
  const link = `${process.env.SERVICE_BASE_URL}/auth/verify-email/${token}`;
  await sendVerificationEmail(email, link);
}

export async function sendVerificationEmail(email: string, link: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: '"Intrasoft" <info@transiflow.com>',
      to: email,
      subject: 'Verify your account',
      html: `<p>Click this link to verify your Ecowaste account email: <a href="${link}">Verify Here</a></p>`,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
}