const express = require('express');
const { register, verifyEmail, login, getUsers, updateUserEmail, verifyEmailUpdate, updateUserFullname, updateUserPassword, updateUserRole, deleteUser } = require('../controllers/user.controller.js');

const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/roleMiddleware.js');

const router = express.Router();

// Регистрация и вход
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

// Управление пользователями (доступно только админам)
router.get('/', authMiddleware, checkRole(['admin']), getUsers);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteUser);
router.put('/update-role/:id', authMiddleware, checkRole(['admin']), updateUserRole);

// Обновление данных пользователя (доступно самому пользователю)
router.put('/update-email/:id', authMiddleware, updateUserEmail);
router.post('/verify-email/:id', authMiddleware, verifyEmailUpdate);
router.put('/update-fullname/:id', authMiddleware, updateUserFullname);
router.put('/update-password/:id', authMiddleware, updateUserPassword);

module.exports = router;