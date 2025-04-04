const express = require('express');
const router = express.Router();
const { getAllModules, getModuleById, getTestsByModule, getLessonsByModule, createModule, updateModule, deleteModule } = require('../controllers/module.controller.js');

const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/roleMiddleware.js');

router.get('/course/:course_id', authMiddleware, getAllModules);
router.get('/:id',authMiddleware, getModuleById);
router.get('/:id/tests',authMiddleware, getTestsByModule);
router.get('/:id/lessons',authMiddleware, getLessonsByModule);
router.post('/', authMiddleware, checkRole(['admin', 'instructor']), createModule);
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), updateModule);
router.delete('/:id',authMiddleware, checkRole(['admin', 'instructor']), deleteModule);

module.exports = router;
