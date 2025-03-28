const mongoose = require('mongoose');

const lessonContentSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  filename: String
});

module.exports = mongoose.model('LessonContent', lessonContentSchema);