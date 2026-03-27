import nodemailer from 'nodemailer';
import { createSigner } from "fast-jwt";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // e.g., smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  family: 4, // 👈 ADD THIS LINE (forces IPv4 on Render)
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
} as SMTPTransport.Options );

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
      from: '"Ecowaste" <info@moelagos.gov.ng>',
      to: email,
      subject: 'Verify your Ecowaste account',
      text: `Verify your Ecowaste account by clicking this link: ${link}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2E7D32;">Welcome to Ecowaste ♻️</h2>
          <p>Thank you for signing up for Ecowaste.</p>
          <p>Please click the button below to verify your email address and activate your account.</p>
          
          <a href="${link}" 
             style="display: inline-block; padding: 12px 20px; margin: 20px 0; 
                    background-color: #2E7D32; color: white; text-decoration: none; 
                    border-radius: 5px;">
            Verify Email
          </a>

          <p>If the button does not work, copy and paste the link below into your browser:</p>
          <p>${link}</p>

          <hr/>
          <small>Ecowaste – Smart Waste Management for a Cleaner City</small>
        </div>
      `,
    });

    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    throw err;
  }
}