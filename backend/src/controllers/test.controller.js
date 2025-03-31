const { Test, Question, Answer } = require('../models');

const createTest = async (req, res) => {
  try {
    const { module_id, title, description } = req.body;
    const test = await Test.create({ module_id, title, description });
    res.status(201).json({ message: 'Тест успешно создан', test });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании теста', error: error.message });
  }
};

const getTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });
    res.status(200).json({ message: 'Тест успешно получен', test });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении теста', error: error.message });
  }
};

const getQuestionsByTestId = async (req, res) => {
  try {
    const testId = req.params.id;

    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    const questions = await Question.findAll({
      where: { test_id: testId },
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

const updateTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });

    const { module_id, title, description } = req.body;
    await test.update({ module_id, title, description });

    res.status(200).json({ message: 'Тест успешно обновлён', test });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении теста', error: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });

    await test.destroy();
    res.status(200).json({ message: 'Тест успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении теста', error: error.message });
  }
};

module.exports = {
    createTest,
    getTest,
    getQuestionsByTestId,
    updateTest,
    deleteTest
};
