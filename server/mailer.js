const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (invoice) => {
  const { client_name, client_email, amount, due_date, description } = invoice;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: client_email,
    subject: `Payment Reminder — ₹${amount} Due`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Payment Reminder</h2>
        <p>Hi <strong>${client_name}</strong>,</p>
        <p>This is a friendly reminder that you have a payment due.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Amount Due</td>
            <td style="padding: 8px;">₹${amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Due Date</td>
            <td style="padding: 8px;">${due_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Description</td>
            <td style="padding: 8px;">${description || 'N/A'}</td>
          </tr>
        </table>
        <p>Please make the payment at your earliest convenience.</p>
        <p style="color: #888; font-size: 12px;">This is an automated reminder.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendReminderEmail };
