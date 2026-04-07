import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Option 1: Use Resend API (Recommended for Render)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${process.env.FROM_NAME || "SkillBridge"} <onboarding@resend.dev>`,
          to: options.email,
          subject: options.subject,
          html: options.message,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send email via Resend API");
      }

      console.log(`✅ Resend API: Email sent successfully to ${options.email}`);
      return data;
    } catch (err) {
      console.error("❌ Resend API Error:", err.message);
      // If Resend fails, we still try standard SMTP as fallback
    }
  }

  // Option 2: Use SMTP (Original logic - fallback)
  let transporter;

  if (process.env.SMTP_USER) {
    // Use Gmail SMTP (or any configured SMTP provider)
    // Reliable Gmail configuration
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback: Ethereal fake email for development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("⚠️ No SMTP credentials found. Using Ethereal test email.");
  }

  const message = {
    from: `${process.env.FROM_NAME || "SkillBridge"} <${process.env.SMTP_USER || "noreply@skillbridge.com"}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(message);

  if (!process.env.SMTP_USER) {
    console.log("\n---------------------------------------------------------");
    console.log(`✉️  DEV MODE: Test Email Sent!`);
    console.log(`📬 View email here: ${nodemailer.getTestMessageUrl(info)}`);
    console.log("---------------------------------------------------------\n");
  } else {
    console.log(`✅ Real email sent successfully to ${options.email}`);
  }
};

export default sendEmail;
