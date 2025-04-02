const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const { enrollInCourse, getMyCourses, unenrollFromCourse } = require('../controllers/enrollment.controller');

const router = express.Router();

// Записаться на курс
router.post('/:courseId/enroll', authMiddleware, enrollInCourse);

// Отписаться от курса
router.delete('/:courseId/unenroll', authMiddleware, unenrollFromCourse);

// Получить список "Мои курсы"
router.get('/my-courses', authMiddleware, getMyCourses);

module.exports = router;