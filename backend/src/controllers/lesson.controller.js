const { Lesson } = require('../models');
const LessonContent = require('../models/LessonContent');

// Создание урока
const createLesson = async (req, res) => {
    try {
      const { module_id, title, content_type, content_text } = req.body;
  
      let content_id = null;
  
      // Если тип контента - файл (video/document), сохраняем его в MongoDB
      if (req.file && (content_type === 'video' || content_type === 'document')) {
        const content = new LessonContent({
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        });
  
        const savedContent = await content.save();
        content_id = savedContent._id.toString();
      }
  
      // Создаём Lesson в PostgreSQL
      const lesson = await Lesson.create({
        module_id,
        title,
        content_type,
        content_id,
        content_text: content_type === 'text' ? content_text : null
      });
  
      res.status(201).json({ message: 'Урок успешно создан', lesson });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании урока', error: error.message });
    }
};

// Получение всех уроков
const getAllLessons = async (req, res) => {
    try {
      const { module_id } = req.query;
  
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

// Получение одного урока
const getLesson = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
      }
  
      const lessonData = lesson.toJSON();
  
      // Если видео или документ — добавим ссылку
      if (lessonData.content_id && (lessonData.content_type === 'video' || lessonData.content_type === 'document')) {
        lessonData.content_url = `${req.protocol}://${req.get('host')}/api/lessons/${lesson.id}/content`;
      } else {
        lessonData.content_url = null;
      }
  
      res.status(200).json({
        message: 'Урок успешно получен',
        lesson: lessonData
      });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении урока', error: error.message });
    }
};

// Обновление урока
const updateLesson = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
      }
  
      const { module_id, title, content_type, content_text } = req.body;
      let updatedFields = { module_id, title, content_type };
  
      if (content_type === 'text') {
        updatedFields.content_text = content_text;
        updatedFields.content_id = null;
      }
  
      if (req.file && (content_type === 'video' || content_type === 'document')) {
        // Удаляем старый файл из MongoDB
        if (lesson.content_id) {
          await LessonContent.findByIdAndDelete(lesson.content_id);
        }
  
        // Загружаем новый файл
        const content = new LessonContent({
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        });
  
        const savedContent = await content.save();
        updatedFields.content_id = savedContent._id.toString();
        updatedFields.content_text = null;
      }
  
      await lesson.update(updatedFields);
  
      res.status(200).json({ message: 'Урок успешно обновлён', lesson });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при обновлении урока', error: error.message });
    }
};

// Удаление урока
const deleteLesson = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
      }
  
      // Удаление контента из MongoDB
      if (lesson.content_id) {
        await LessonContent.findByIdAndDelete(lesson.content_id);
      }
  
      // Удаление урока из PostgreSQL
      await lesson.destroy();
  
      res.status(200).json({ message: 'Урок успешно удалён' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении урока', error: error.message });
    }
};

const getLessonContent = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson || !lesson.content_id) {
        return res.status(404).send('Контент не найден');
      }
  
      const content = await LessonContent.findById(lesson.content_id);
      if (!content) {
        return res.status(404).send('Контент не найден в базе MongoDB');
      }
  
      res.contentType(content.contentType);
      res.send(content.data);
    } catch (error) {
      res.status(500).send('Ошибка при получении контента');
    }
};

module.exports = {
  createLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getLessonContent
};
