const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:[true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'tour name must be between 10 ~ 40 characters'],
            minlength: [10, 'tour name must be between 10 ~ 40 characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'duration must be specified']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'maximum group size must be specified'],
        },
        difficulty: {
            type: String,
            enum: {
                values: ['easy', 'medium', 'hard'],
                message: 'Difficulty is either: easy, medium, hard'
            },
            required: [true, 'tour difficulty must be specified'],
            ratingsAverage: {
                type: Number,
                default: 1,
                min: [1, 'Rating must be equal or above 1.0'],
                max: [5, 'Rating must be equal or below 5.0'],
                set: val => ((Math.round(val * 10)) / 10)
            },
            ratingsQuantity: {
                type: Number,
                default: 0
            },
            price: {
                type: Number,
                required: [true, 'Price is not specified'],
            },
            discountPercentage: {
                type: Number,
                min: [0, 'percentage must be greater than 0 and smaller than 1'],
                max: [1, 'percentage must be greater than 0 and smaller than 1'],
            },
            summary: {
                type: String,
                required: [true, 'tour summary not specified']
            },
            description: {
                type: String,
                required: [true, 'tour description must be specified']
            },
            imageCover: {
                type: String,
                required: [true, 'A tour must have a cover image']
            },
            images: [String],
            createdAt: {
                type: Date,
                default: Date.now(),
                select:false
            },
            startDates: [Date],
            secretTour: {
                type: Boolean,
                default: false
            },
            guides: [{
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }]
        }
    },
        {
            toJSON: {virtuals: true},
            toObject: {virtuals: true}
        }
);

tourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour'
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;