
const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetURL) => {
  try {
    const senderEmail = process.env.EMAIL_USER?.trim();
    const appPassword = process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, "");

    if (!senderEmail || !appPassword) {
      throw new Error("Email credentials are missing in .env");
    }

    // Safe diagnostics: never print the password.
    console.log("Email sender configured:", Boolean(senderEmail));
    console.log("App password length:", appPassword.length);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    await transporter.verify();

    console.log("Gmail SMTP connection successful.");

    const info = await transporter.sendMail({
      from: `"Edu-Path AI" <${senderEmail}>`,
      to: email,
      subject: "Edu-Path AI - Password Reset",
      text: `Reset your password using this link: ${resetURL}. This link expires in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your Edu-Path AI password.</p>
          <p>Click below to create a new password:</p>

          <a href="${resetURL}"
             style="display:inline-block;padding:12px 22px;
             background:#4f46e5;color:white;text-decoration:none;
             border-radius:6px;">
            Reset Password
          </a>

          <p>This link expires in 15 minutes.</p>
          <p>If you did not request this reset, ignore this email.</p>
        </div>
      `,
    });

    console.log("Password reset email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = { sendResetEmail };
