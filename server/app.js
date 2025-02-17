
// 
// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const socketIo = require('socket.io');
// const http = require('http');
// const chatRoutes = require('./routes/chatRoutes');
// const Message = require('./models/Message');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use(chatRoutes); // Chat routes

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/chatApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// // Socket.IO setup for real-time messaging
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Send existing messages to the client when they connect
//   Message.find().sort({ createdAt: -1 }).limit(10).then((messages) => {
//     socket.emit('receiveMessages', messages);
//   });

//   // Listen for new messages and broadcast them to all clients
//   socket.on('sendMessage', async (messageData) => {
//     const newMessage = new Message(messageData);
//     await newMessage.save(); // Save the message to MongoDB
//     io.emit('receiveMessage', newMessage); // Broadcast message to all clients
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const helpRequestRoutes = require('./routes/helpRequest');
const chatRoutes = require('./routes/chatRoutes');
const upload = require('./middleware/upload'); // Multer middleware
const communityRoutes = require('./routes/community');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// MongoDB connection
const dbUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017/chatApp';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Database connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/help-request', helpRequestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes); 

// File Upload Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(201).json({ message: 'File uploaded', path: req.file.path });
});

app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
  const filePaths = req.files.map(file => file.path);
  res.status(201).json({ message: 'Files uploaded', paths: filePaths });
});

app.get('/api/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

app.delete('/api/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ message: 'Error deleting file' });
    res.json({ message: 'File deleted' });
  });
});


// Socket.IO setup for real-time messaging
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  // Send existing messages to the client when they connect
  Message.find().sort({ createdAt: -1 }).limit(10).then((messages) => {
    socket.emit('receiveMessages', messages);
  });

  // Listen for new messages and broadcast them to all clients
  socket.on('sendMessage', async (messageData) => {
    const newMessage = new Message(messageData);
    await newMessage.save(); // Save the message to MongoDB
    io.emit('receiveMessage', newMessage); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
