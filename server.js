const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ইমেইল সেটআপ (আপনার aevy.brand@gmail.com দিয়ে)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aevy.brand@gmail.com',
    pass: 'zgmi frsm nnwk zeny'  // আপনার App Password
  }
});

// শুধু ইমেইল পাঠানোর API
app.post('/send-email', async (req, res) => {
  const { email, message } = req.body;
  
  try {
    await transporter.sendMail({
      from: '"AEVY" <aevy.brand@gmail.com>',
      to: 'contract.aevy@gmail.com',  // এখানেই ইমেইল যাবে
      subject: `New message from ${email}`,
      text: `From: ${email}\n\nMessage: ${message}`,
      replyTo: email
    });
    
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000);