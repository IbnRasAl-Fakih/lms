const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // до 200MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'video/mp4',
      'video/mov',
      'video/x-matroska',
      'video/avi',
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Неверный тип файла'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;