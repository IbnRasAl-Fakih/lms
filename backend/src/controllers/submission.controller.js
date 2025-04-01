const { Submission } = require('../models');

const createSubmission = async (req, res) => {
  try {
    const { user_id, test_id, score } = req.body;
    const submission = await Submission.create({ user_id, test_id, score });
    res.status(201).json({ message: 'Результат успешно создан', submission });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании результата', error: error.message });
  }
};

const getAllSubmissions = async (req, res) => {
    try {
      const { user_id, test_id } = req.query;
  
      const whereClause = {};
      if (user_id) whereClause.user_id = user_id;
      if (test_id) whereClause.test_id = test_id;
  
      const submissions = await Submission.findAll({ where: whereClause });
      res.status(200).json({ submissions });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении результатов', error: error.message });
    }
};

const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Результат не найден' });
    }
    res.status(200).json({ submission });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении результата', error: error.message });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Результат не найден' });
    }

    const { score } = req.body;
    await submission.update({ score });
    res.status(200).json({ message: 'Результат успешно обновлён', submission });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении результата', error: error.message });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Результат не найден' });
    }

    await submission.destroy();
    res.status(200).json({ message: 'Результат успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении результата', error: error.message });
  }
};

module.exports = { createSubmission, getAllSubmissions, getSubmission, updateSubmission, deleteSubmission };
