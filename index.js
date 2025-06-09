const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Setup transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📩 Send admin or custom message
app.post("/send", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"OOHR Vision" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial; padding: 20px; color: #333;">
          <h2>Message from OOHR Vision</h2>
          <h4>${message}</h4>
          <hr />
          <p style="color: #666;">Thank you,<br><strong>OOHR Vision Team</strong></p>
        </div>
      `
    });
    
    res.send({ success: true });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// ✅ Send welcome email on signup
app.post("/send-signup-welcome", async (req, res) => {
  const { to, name } = req.body;
   console.log("📩 Sending welcome email to:", to, name); // ✅ Add this
  const mailOptions = {
    from: `"OOHR Vision" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to OOHR Vision!",
    html: `
      <div style="font-family: Arial; padding: 20px; color: #333;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for signing up with <strong>OOHR Vision</strong>.</p>
        <p>We're excited to have you on board.</p>
        <p>Login anytime to track your vehicle and stay informed!</p>
        <hr />
        <p style="color: #666;">Best regards,<br><strong>OOHR Vision Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
