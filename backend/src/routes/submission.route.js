const express = require('express');
const { createSubmission, getAllSubmissions, getSubmission, updateSubmission, deleteSubmission } = require('../controllers/submission.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createSubmission);

// Получить все результаты
router.get('/', authMiddleware, checkRole(['instructor', 'admin']), getAllSubmissions);

// Получить конкретный результат
router.get('/:id', authMiddleware, getSubmission);

// Обновить результат (только админ или инструктор)
router.put('/:id', authMiddleware, checkRole(['instructor', 'admin']), updateSubmission);

// Удалить результат (только админ)
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteSubmission);

module.exports = router;