const mongoose = require('mongoose');

// Define the schema for community members
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

// Export the Member model
module.exports = mongoose.model('Member', memberSchema);
