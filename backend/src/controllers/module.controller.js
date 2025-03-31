const { Module } = require('../models');
const { Test } = require('../models');
const { Lesson } = require('../models');

const getAllModules = async (req, res) => {
  const { course_id } = req.params;
  try {
    const modules = await Module.findAll({
      where: { course_id }
    });
    res.status(200).json({ message: 'Модули успешно получены', data: modules });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении модулей по курсу', error });
  }
};

const getModuleById = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Модуль не найден' });
    }
    res.status(200).json({ message: 'Модуль успешно найден', data: module });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении модуля', error });
  }
};

const getTestsByModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    
    if (!moduleId) {
      return res.status(400).json({ message: 'module_id обязателен' });
    }

    const tests = await Test.findAll({ where: { module_id: moduleId } });

    res.status(200).json({ message: 'Список тестов по модулю успешно получен', tests });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении тестов', error: error.message });
  }
};

const getLessonsByModule = async (req, res) => {
  try {
    const module_id = req.params.id;

    if (!module_id) {
      return res.status(400).json({ message: 'module_id обязателен' });
    }

    const lessons = await Lesson.findAll({ where: { module_id } });

    const lessonsWithLinks = lessons.map((lesson) => {
      const data = lesson.toJSON();

      if (data.content_id && (data.content_type === 'video' || data.content_type === 'document')) {
        data.content_url = `${req.protocol}://${req.get('host')}/api/lessons/${data.id}/content`;
      } else {
        data.content_url = null;
      }

      return data;
    });

    res.status(200).json({
      message: 'Уроки успешно получены',
      lessons: lessonsWithLinks
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении уроков', error: error.message });
  }
};

const createModule = async (req, res) => {
    const { course_id, title, description } = req.body;
  
    if (!course_id || !title) {
      return res.status(400).json({ message: 'course_id и title являются обязательными полями' });
    }
  
    try {
      const newModule = await Module.create({ course_id, title, description });
      res.status(201).json({ message: 'Модуль успешно создан', data: newModule });
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при создании модуля', error: error });
    }
};

const updateModule = async (req, res) => {
    const { title, description } = req.body;
  
    if (!title) {
      return res.status(400).json({ message: 'Поле title обязательно для обновления' });
    }
  
    try {
      const [updated] = await Module.update(
        { title, description },
        { where: { id: req.params.id } }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Модуль не найден' });
      }
  
      const updatedModule = await Module.findByPk(req.params.id);
  
      res.status(200).json({ message: 'Модуль успешно обновлён', data: updatedModule });
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при обновлении модуля', error });
    }
};

const deleteModule = async (req, res) => {
    const { id } = req.params;
  
    try {
      const module = await Module.findByPk(id);
      if (!module) {
        return res.status(404).json({ message: 'Модуль не найден' });
      }
  
      await module.destroy();
  
      res.status(200).json({ message: 'Модуль успешно удалён', data: { id } });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении модуля', error: error });
    }
};

module.exports = { getAllModules, getModuleById, getTestsByModule, getLessonsByModule, createModule, updateModule, deleteModule };