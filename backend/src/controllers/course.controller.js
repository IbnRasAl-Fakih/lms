const { Course } = require('../models');
const { Module } = require('../models');
const CourseImage = require('../models/CourseImage');
const upload = require('../middlewares/upload');

const createCourse = async (req, res) => {
    try {
      const { title, description, category } = req.body;
  
      let background_image_id = null;
  
      if (req.file) {
        const image = new CourseImage({
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        });
  
        const savedImage = await image.save();
        background_image_id = savedImage._id.toString();
      }
  
      const course = await Course.create({
        title,
        description,
        category,
        created_by: req.user.id,
        background_image_id
      });
  
      res.status(201).json({ message: 'Курс успешно создан', course });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании курса', error: error.message });
    }
};  

const getAllCourses = async (req, res) => {
    try {
      const courses = await Course.findAll();
  
      const coursesWithImages = courses.map((course) => {
        const courseData = course.toJSON();
  
        courseData.backgroundImageUrl = course.background_image_id
          ? `${req.protocol}://${req.get('host')}/api/courses/${course.id}/image`
          : null;
  
        return courseData;
      });
  
      res.status(200).json({ message: 'Список курсов успешно получен', courses: coursesWithImages });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении курсов', error: error.message });
    }
};
  

const getCourse = async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Курс не найден' });
      }
  
      const courseData = course.toJSON();
  
      if (course.background_image_id) {
        courseData.backgroundImageUrl = `${req.protocol}://${req.get('host')}/api/courses/${course.id}/image`;
      } else {
        courseData.backgroundImageUrl = null;
      }
  
      res.status(200).json({ message: 'Курс успешно получен', course: courseData });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении курса', error: error.message });
    }
};

const getModulesByCourse = async (req, res) => {
  const course_id = req.params.id;
  try {
    const modules = await Module.findAll({
      where: { course_id }
    });
    res.status(200).json({ message: 'Модули успешно получены', data: modules });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении модулей по курсу', error: error.message });
  }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Курс не найден' });
        }

        if (req.user.role !== 'admin' && req.user.id !== course.created_by) {
            return res.status(403).json({ message: 'Недостаточно прав для обновления курса' });
        }

        const { title, description, category } = req.body;
        await course.update({ title, description, category });

        if (req.file) {
            if (course.background_image_id) {
                await CourseImage.findByIdAndDelete(course.background_image_id);
            }

            const image = new CourseImage({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                filename: req.file.originalname
            });
            const savedImage = await image.save();

            await course.update({ background_image_id: savedImage._id.toString() });
        }

        res.status(200).json({ message: 'Курс успешно обновлён', course });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении курса', error: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Курс не найден' });
        }

        if (req.user.role !== 'admin' && req.user.id !== course.created_by) {
            return res.status(403).json({ message: 'Недостаточно прав для удаления курса' });
        }

        if (course.background_image_id) {
            await CourseImage.findByIdAndDelete(course.background_image_id);
        }

        await course.destroy();
        res.status(200).json({ message: 'Курс успешно удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении курса', error: error.message });
    }
};

const getCourseImage = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course || !course.background_image_id) {
            return res.status(404).send('Изображение не найдено');
        }

        const image = await CourseImage.findById(course.background_image_id);
        if (!image) return res.status(404).send('Изображение не найдено');

        res.contentType(image.contentType);
        res.send(image.data);
    } catch (err) {
        res.status(500).send('Ошибка при получении изображения');
    }
};

module.exports = { createCourse, getAllCourses, getCourse, getModulesByCourse, updateCourse, deleteCourse, getCourseImage };