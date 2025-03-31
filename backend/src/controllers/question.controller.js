const { Question, Answer } = require('../models');

const createQuestion = async (req, res) => {
  try {
    const { test_id, question_text, question_type, answers } = req.body;

    const question = await Question.create({ test_id, question_text, question_type });

    if (Array.isArray(answers)) {
      for (const answer of answers) {
        await Answer.create({ ...answer, question_id: question.id });
      }
    }

    res.status(201).json({ message: 'Вопрос и ответы созданы', question });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании вопроса', error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
        include: {
          model: Answer,
          as: 'answers'
        }
      });
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении вопросов', error: error.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, { include: { model: Answer, as: 'answers' }});
    if (!question) return res.status(404).json({ message: 'Вопрос не найден' });

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении вопроса', error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { question_text, question_type, answers } = req.body;

    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'Вопрос не найден' });

    await question.update({ question_text, question_type });

    if (Array.isArray(answers)) {
      await Answer.destroy({ where: { question_id: question.id } });
      for (const answer of answers) {
        await Answer.create({ ...answer, question_id: question.id });
      }
    }

    res.status(200).json({ message: 'Вопрос обновлён', question });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении вопроса', error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'Вопрос не найден' });

    await Answer.destroy({ where: { question_id: question.id } });
    await question.destroy();

    res.status(200).json({ message: 'Вопрос и его ответы удалены' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении вопроса', error: error.message });
  }
};

module.exports = { createQuestion, getAllQuestions, getQuestion, updateQuestion, deleteQuestion };