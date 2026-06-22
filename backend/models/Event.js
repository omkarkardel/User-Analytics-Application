const mongoose = require('mongoose');

// Event schema (as requested)
//
// Event
// {
//   sessionId: String,
//   eventType: String,
//   pageUrl: String,
//   timestamp: Date,
//   clickX: Number,
//   clickY: Number
// }
const eventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'click'],
    index: true,
  },
  pageUrl: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  clickX: {
    type: Number,
    default: null,
  },
  clickY: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model('Event', eventSchema);

