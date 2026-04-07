import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from backend folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const testEmail = async () => {
    console.log("🔍 Checking SMTP settings...");
    console.log("   User:", process.env.SMTP_USER);
    console.log("   Pass:", process.env.SMTP_PASS ? "******** (Hidden)" : "MISSING");

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ ERROR: Missing SMTP_USER or SMTP_PASS in .env file.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log("⏳ Verification in progress...");
        await transporter.verify();
        console.log("✅ SUCCESS: Your SMTP settings are correct!");
        
        console.log("⏳ Sending a test email to yourself...");
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: "SkillBridge: Test Email Successful!",
            text: "If you see this, your Gmail App Password is working perfectly!"
        });
        console.log("📬 CHECK YOUR INBOX! The test email has been sent.");

    } catch (error) {
        console.error("❌ ERROR: Something is wrong with your email setup.");
        console.error("   Details:", error.message);
        if (error.message.includes("Invalid login")) {
            console.log("\n💡 TIP: 'Invalid login' usually means your App Password is typed wrong OR you used your normal password instead of a 16-character App Password.");
        }
    }
};

testEmail();
