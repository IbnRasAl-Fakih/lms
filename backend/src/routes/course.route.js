const express = require('express');
const upload = require('../middlewares/upload');
const { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse, getCourseImage } = require('../controllers/course.controller.js');

const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/roleMiddleware.js');

const router = express.Router();

// Создание курса (только для админа или инструктора)
router.post('/create', authMiddleware, checkRole(['admin', 'instructor']), upload.single('image'), createCourse);

router.get('/', authMiddleware, getAllCourses);

// Получение одного курса по ID
router.get('/:id', authMiddleware, getCourse);

// Обновление курса (только для автора или админа)
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), upload.single('image'), updateCourse);

// Удаление курса (только для автора или админа)
router.delete('/:id', authMiddleware, checkRole(['admin', 'instructor']), deleteCourse);

router.get('/:id/image', getCourseImage);

module.exports = router;
