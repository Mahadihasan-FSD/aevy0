const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// CORS সব অনুমতি দিন (সহজ সমাধান)
app.use(cors({
  origin: '*',  // সব origin থেকে অনুমতি
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aevy.brand@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/send-email', async (req, res) => {
  const { email, message } = req.body;
  
  // CORS headers manually যোগ করুন
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONS request handle করুন (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  
  try {
    await transporter.sendMail({
      from: '"AEVY" <aevy.brand@gmail.com>',
      to: 'contract.aevy@gmail.com',
      subject: `New message from ${email}`,
      text: `From: ${email}\n\nMessage: ${message}`,
      replyTo: email
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});