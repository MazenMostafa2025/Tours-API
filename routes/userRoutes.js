const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();


// Authentication
router.post('/signup', authController.signup)
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.get('/logout', authController.logout);

// User Settings
router.use(authController.protect);

router.get('/getMe', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.getMe, userController.updateMe);
router.patch('/updatePassword', authController.updatePassword);
router.delete('deleteMe', userController.getMe, userController.deleteMe);

// Admin Settings
router.use(authController.authorize(['admin']))

router.route('/:id')
        .get(userController.getAllUsers)
        .patch(userController.updateUser)
        .delete(userController.deleteUser);

module.exports = router;