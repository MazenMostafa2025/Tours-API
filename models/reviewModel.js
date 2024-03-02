const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    },
    review: {
        type: String,
        required: [true, 'review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

reviewSchema.index({ tour: 1, user: 1}, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({path: 'user' , select: 'name'})
    // populate({path: 'tour' , select: 'name'}).
    next();
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;