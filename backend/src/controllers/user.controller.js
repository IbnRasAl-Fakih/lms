require('dotenv').config({ path: '../.env' });  

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const emailVerificationCodes = new Map();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const register = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        emailVerificationCodes.set(email, { code: verificationCode, full_name, role, password });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Ваш код подтверждения: ${verificationCode}`,
        });

        res.status(200).json({ message: 'Код подтверждения отправлен на email' });

    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const storedData = emailVerificationCodes.get(email);
        if (!storedData || storedData.code !== code) {
            return res.status(400).json({ message: 'Неверный код подтверждения' });
        }

        const hashedPassword = await bcrypt.hash(storedData.password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            full_name: storedData.full_name,
            role: storedData.role,
        });

        emailVerificationCodes.delete(email);

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Неверный email или пароль' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'email', 'full_name', 'role'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const updateUserEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (email === user.email) {
            return res.status(400).json({ message: 'Вы указали тот же email' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Этот email уже используется другим пользователем' });
        }

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        emailVerificationCodes.set(email, { code: verificationCode, userId: id });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Подтверждение изменения email',
            text: `Ваш код подтверждения: ${verificationCode}`,
        });

        res.status(200).json({ message: 'Код подтверждения отправлен на email' });

    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const verifyEmailUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, code } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const storedCode = emailVerificationCodes.get(email);
        if (!storedCode || storedCode.userId !== id) {
            return res.status(400).json({ message: 'Код не найден или не соответствует пользователю' });
        }

        if (storedCode.code !== code) {
            return res.status(400).json({ message: 'Неверный код подтверждения' });
        }

        emailVerificationCodes.delete(email);

        await user.update({ email });

        res.status(200).json({ message: 'Email успешно обновлен', user });

    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const updateUserFullname = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await user.update({ full_name });

        res.json({ message: 'Данные обновлены', user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Старый пароль неверен' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({ password: hashedPassword });

        res.status(200).json({ message: 'Пароль успешно обновлен', user });

    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await user.update({ role });

        res.json({ message: 'Данные обновлены', user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        await user.destroy();
        res.json({ message: 'Пользователь удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { register, verifyEmail, login, getUsers, updateUserEmail, verifyEmailUpdate, updateUserFullname, updateUserPassword, updateUserRole, deleteUser };