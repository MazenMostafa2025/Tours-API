const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.authorize(['user']), reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)
.patch(authController.authorize(['admin', 'user']), reviewController.updateReview)
.delete(authController.authorize(['admin', 'user']), reviewController.deleteReview);

module.exports = router;