const Tour = require('../models/tourModel');
const factory = require('../controllers/factoryController');



module.exports.createTour = factory.createOne(Tour);
module.exports.getAllTours = factory.getAll(Tour);
module.exports.getTour = factory.getOne(Tour);
module.exports.updateTour = factory.updateOne(Tour);
module.exports.deleteTour = factory.deleteOne(Tour);


