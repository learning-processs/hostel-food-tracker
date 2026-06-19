// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  // If credentials are empty, skip SMTP handshake entirely and print a clean mock trace
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\x1b[33m[Email Dev Mode]: Simulated email notification sent to ${to}\x1b[0m`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hostel Food Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

export default sendEmail;