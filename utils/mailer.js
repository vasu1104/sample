require("dotenv").config(); // Load .env

const nodemailer = require("nodemailer");

async function sendEmail(clientEmail) {
  const htmlTemp = `
    <h4>Dear Customer,</h4>
    <p>Your vehicle service is now completed.</p>
    <p>Please visit the garage to drive your vehicle back home.</p>
    <br><p>Thank you,</p>
    <p><strong>Autorizz Garage</strong></p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Autorizz Garage" <${process.env.GMAIL_USER}>`,
    to: clientEmail,
    subject: "Autorizz Service Update",
    html: htmlTemp,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Mail sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Mail error:", error);
    return false;
  }
}

module.exports = sendEmail;
