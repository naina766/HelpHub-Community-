// models/Message.js
const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
