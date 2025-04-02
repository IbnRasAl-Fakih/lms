const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
    filename: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);