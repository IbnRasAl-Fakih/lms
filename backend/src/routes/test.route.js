const express = require('express');
const router = express.Router();

const { createTest, getTest, getQuestionsByTestId, updateTest, deleteTest } = require('../controllers/test.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Создание теста (инструктор или админ)
router.post('/create', authMiddleware, checkRole(['admin', 'instructor']), createTest);

// Получение одного теста по ID
router.get('/:id', authMiddleware, getTest);

router.get('/:id/questions', authMiddleware, getQuestionsByTestId);

// Обновление теста
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), updateTest);

// Удаление теста
router.delete('/:id', authMiddleware, checkRole(['admin', 'instructor']), deleteTest);

module.exports = router;