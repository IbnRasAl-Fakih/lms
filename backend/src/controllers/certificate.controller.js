const puppeteer = require('puppeteer');
const { Certificate, User, Course } = require('../models');
const generateTemplate = require('../utils/certificate.template');

const issueCertificate = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await Certificate.findOne({ where: { user_id, course_id } });
    if (existing) {
      return res.status(400).json({ message: 'Сертификат уже выдан' });
    }

    const certificate = await Certificate.create({ user_id, course_id });
    res.status(201).json({ message: 'Сертификат выдан', certificate });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при выдаче сертификата', error: err.message });
  }
};

const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ certificates });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сертификатов', error: err.message });
  }
};

const generateCertificatePDF = async (req, res) => {
    try {
      const { id } = req.params;
  
      const certificate = await Certificate.findByPk(id, {
        include: [
          { model: User, attributes: ['full_name'] },
          { model: Course, attributes: ['title'] },
        ],
      });
  
      if (!certificate) {
        return res.status(404).json({ message: 'Сертификат не найден' });
      }
  
      const fullName = certificate.User.full_name;
      const courseTitle = certificate.Course.title;
      const issuedDate = new Date(certificate.issued_at).toLocaleDateString('ru-RU');
      const certificateNumber = certificate.id.slice(0, 8);
  
      const html = generateTemplate({ fullName, courseTitle, issuedDate, certificateNumber });
  
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
  
      await page.setContent(html, { waitUntil: 'networkidle0' });
  
      const pdfBuffer = await page.pdf({
        width: '2480px',
        height: '3508px',
        printBackground: true,
      });
  
      await browser.close();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=certificate.pdf');
      res.end(pdfBuffer);
  
    } catch (error) {
      console.error('❌ Ошибка генерации PDF:', error);
      res.status(500).json({ message: 'Ошибка генерации PDF', error: error.message });
    }
};

module.exports = { issueCertificate, getMyCertificates, generateCertificatePDF };