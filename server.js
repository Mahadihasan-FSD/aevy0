const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// CORS সব অনুমতি
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Check environment variable
if (!process.env.EMAIL_PASSWORD) {
  console.error('❌ ERROR: EMAIL_PASSWORD environment variable is not set!');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aevy.brand@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/send-email', async (req, res) => {
  const { email, message } = req.body;
  
  console.log(`📧 Received request from: ${email}`);
  
  if (!email || !message) {
    return res.status(400).json({ success: false, error: 'Email and message required' });
  }
  
  try {
    await transporter.sendMail({
      from: '"AEVY" <aevy.brand@gmail.com>',
      to: 'contract.aevy@gmail.com',
      subject: `New message from ${email}`,
      text: `From: ${email}\n\nMessage: ${message}`,
      replyTo: email
    });
    
    console.log('✅ Email sent successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('AEVY Email Server is running');
});

// Use Render's PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: https://aevy-email-server.onrender.com`);
  console.log(`🔐 EMAIL_PASSWORD is ${process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET'}`);
});
