const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/userModel');
const factory = require('../controllers/factoryController');



module.exports.getMe = async (req, res, next) => {
    req.params.id = req.user._id;
    next();
};

module.exports.updateMe = catchAsync( async (req, res, next) => {
    
    if (req.body.password || req.body.passwordConfirm) {
        next(new AppError('this route is not for updating password please try this route "/users/updatePassword"', 400));
    }
    
    const filteredReqBody = filterObj(req.body, 'name', 'email');

    const user = await Model.findByIdAndUpdate(req.user._id, filteredReqBody ,{runValidators: true, new:true});

    res.status(200).json({
        status: 'success',
        data: user
    });
});

module.exports.deleteMe = catchAsync( async (req, res, next) => {
    
    await Model.findByIdAndUpdate(req.user._id, {active: false});
    
    res.status(200).json({
        status: 'success',
        data: null
    });
});



module.exports.getUser = factory.getOne(User);
module.exports.getAllUsers = factory.getAll(User);
module.exports.updateUser = factory.updateOne(User);
module.exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};