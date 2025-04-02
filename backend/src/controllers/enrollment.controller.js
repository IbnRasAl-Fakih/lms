const { Enrollment } = require('../models');

const enrollInCourse = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { courseId } = req.params;

    const [enrollment, created] = await Enrollment.findOrCreate({
      where: { user_id, course_id: courseId }
    });

    if (!created) {
      return res.status(400).json({ message: 'Вы уже записаны на этот курс' });
    }

    res.status(201).json({ message: 'Запись на курс успешна' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при записи на курс', error: error.message });
  }
};

const unenrollFromCourse = async (req, res) => {
    try {
      const { id: user_id } = req.user;
      const { courseId } = req.params;
  
      const enrollment = await Enrollment.findOne({
        where: { user_id, course_id: courseId }
      });
  
      if (!enrollment) {
        return res.status(404).json({ message: 'Вы не записаны на этот курс' });
      }
  
      await enrollment.destroy();
      res.status(200).json({ message: 'Вы успешно отписались от курса' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при отписке от курса', error: error.message });
    }
};

const getMyCourses = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const enrollments = await Enrollment.findAll({
        where: { user_id },
        include: [{ association: 'course' }]
      });
      
      const courses = enrollments.map(e => e.course);
    res.status(200).json({ message: 'Ваши курсы', courses });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении курсов', error: error.message });
  }
};

module.exports = { enrollInCourse, getMyCourses, unenrollFromCourse };