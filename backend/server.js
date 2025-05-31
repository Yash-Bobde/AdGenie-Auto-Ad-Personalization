const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Message state
let currentMessage = null;
let messageProcessed = false;

// POST: Receive new message and broadcast via socket
app.post('/api/postMessage', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  currentMessage = message;
  messageProcessed = false;

  io.emit('newMessage', currentMessage);
  console.log(`[Socket] Broadcasted message: ${message}`);

  res.status(200).json({ success: true });
});

// GET: Fetch current message
app.get('/api/getMessage', (req, res) => {
  res.json({ message: currentMessage });
});

// POST: Update message status as processed
app.post('/api/status', (req, res) => {
  messageProcessed = true;
  currentMessage = null;

  res.json({ success: true });
});

// GET: Check message processing status
app.get('/api/status', (req, res) => {
  res.json({ messageProcessed });
});

// Optional: Health check endpoint
app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
