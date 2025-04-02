const express = require('express');
const { issueCertificate, uploadCertificate, downloadCertificate, getMyCertificates, generateCertificatePDF  } = require('../controllers/certificate.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/issue', authMiddleware, checkRole(['admin', 'instructor']), issueCertificate);
router.post('/upload', authMiddleware, upload.single('file'), uploadCertificate);
router.get('/:id/download', authMiddleware, downloadCertificate);
router.get('/my', authMiddleware, getMyCertificates);
router.get('/:id/pdf', authMiddleware, generateCertificatePDF);

module.exports = router;