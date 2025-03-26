const express = require('express');
const { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse } = require('../controllers/course.controller.js');

const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/roleMiddleware.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Управление курсами
 */

/**
 * @swagger
 * /courses/create:
 *   post:
 *     tags: [Courses]
 */

// Создание курса (только для админа или инструктора)
router.post('/create', authMiddleware, checkRole(['admin', 'instructor']), createCourse);


/**
 * @swagger
 * /courses:
 *   get:
 *     tags: [Courses]
 */

router.get('/', authMiddleware, getAllCourses);

// Получение одного курса по ID
router.get('/:id', authMiddleware, getCourse);

// Обновление курса (только для автора или админа)
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), updateCourse);

// Удаление курса (только для автора или админа)
router.delete('/:id', authMiddleware, checkRole(['admin', 'instructor']), deleteCourse);

module.exports = router;
