const Review = require('../models/reviewModel');
const factory = require('../controllers/factoryController');

reviewController.getAllReviews = factory.getAll(Review);
reviewController.getReview = factory.getOne(Review);
reviewController.createReview = factory.createOne(Review);
reviewController.updateReview = factory.updateOne(Review);
reviewController.deleteReview = factory.deleteOne(Review);