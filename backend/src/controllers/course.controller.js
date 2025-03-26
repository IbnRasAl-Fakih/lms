const { Course } = require('../models');

const createCourse = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const course = await Course.create({
            title,
            description,
            category,
            created_by: req.user.id,
        });

        res.status(201).json({ message: 'Курс успешно создан', course: course });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании курса', error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({ message: 'Список курсов успешно получен', courses });
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
        res.status(200).json({ message: 'Курс успешно получен', course });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении курса', error: error.message });
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

        await course.destroy();
        res.status(200).json({ message: 'Курс успешно удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении курса', error: error.message });
    }
};

module.exports = { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse };
