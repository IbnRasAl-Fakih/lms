const { Lesson } = require('../models');
const LessonContent = require('../models/LessonContent');

const createLesson = async (req, res) => {
    try {
      const { module_id, title, content_type, content_text } = req.body;
  
      let content_id = null;

      if (req.file && (content_type === 'video' || content_type === 'document')) {
        const content = new LessonContent({
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        });
  
        const savedContent = await content.save();
        content_id = savedContent._id.toString();
      }

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

const getLesson = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
      }
  
      const lessonData = lesson.toJSON();

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
        if (lesson.content_id) {
          await LessonContent.findByIdAndDelete(lesson.content_id);
        }

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

const deleteLesson = async (req, res) => {
    try {
      const lesson = await Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
      }

      if (lesson.content_id) {
        await LessonContent.findByIdAndDelete(lesson.content_id);
      }

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

module.exports = { createLesson, getLesson, updateLesson, deleteLesson, getLessonContent };
