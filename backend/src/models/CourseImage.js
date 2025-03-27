const mongoose = require('mongoose');

const courseImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CourseImage', courseImageSchema);