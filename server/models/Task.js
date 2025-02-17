const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  location: { type: String, required: true },
  deadline: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true }, // e.g., Household, Education
  status: { type: String,enum: ['Pending', 'In Progress', 'Completed'], default: 'in-progress' }, // 'completed' or 'in-progress'
  comments: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String }],
  ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }]
});

module.exports = mongoose.model('Task', taskSchema);
