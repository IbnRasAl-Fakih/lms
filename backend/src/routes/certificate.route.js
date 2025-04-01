const express = require('express');
const { issueCertificate, getMyCertificates, generateCertificatePDF  } = require('../controllers/certificate.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/issue', authMiddleware, checkRole(['admin', 'instructor']), issueCertificate);
router.get('/my', authMiddleware, getMyCertificates);
router.get('/:id/pdf', authMiddleware, generateCertificatePDF);

module.exports = router;