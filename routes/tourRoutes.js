const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);

router.route('/')
.get(authController.authorize(['user', 'guide']), tourController.getAllTours).
post(authController.authorize(['admin']),tourController.createTour);

router.route('/:id')
.get(authController.authorize(['user', 'guide']), tourController.getTour)
.patch(authController.authorize(['admin']), tourController.updateTour)
.delete(authController.authorize(['admin']), tourController.deleteTour);

module.exports = router;