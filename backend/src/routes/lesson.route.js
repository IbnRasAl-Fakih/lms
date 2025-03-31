const express = require('express');
const { createLesson, getLesson, updateLesson, deleteLesson, getLessonContent } = require('../controllers/lesson.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

// Создание урока (только для админа или инструктора)
router.post('/', authMiddleware, checkRole(['admin', 'instructor']), upload.single('file'), createLesson);
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), upload.single('file'), updateLesson);
router.delete('/:id', authMiddleware, checkRole(['admin', 'instructor']), deleteLesson);

router.get('/:id', authMiddleware, getLesson);

// Получение контента урока (файл)
router.get('/:id/content', getLessonContent);

module.exports = router;