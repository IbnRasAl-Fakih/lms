const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/question.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Только для admin или instructor
router.post('/', authMiddleware, checkRole(['admin', 'instructor']), createQuestion);
router.get('/', authMiddleware, getAllQuestions);
router.get('/:id', authMiddleware, getQuestion);
router.put('/:id', authMiddleware, checkRole(['admin', 'instructor']), updateQuestion);
router.delete('/:id', authMiddleware, checkRole(['admin', 'instructor']), deleteQuestion);

module.exports = router;