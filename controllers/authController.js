const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utilities/Mail'); 

const signTokenAndSendResponse = (user, statusCode, req, res) => {
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE});
    
    res.cookie('jwt', token , {
        maxAge: 1000*60*60*24*process.env.JWT_COOKIE_EXPIRY,
        httpOnly: true,     
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    user.password = undefined;
    
    res.status(statusCode).json({
    status: 'success',
    data: user,
    token
    });
}

module.exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        passwordConfirm: req.body.passwordConfirm
    });
    signTokenAndSendResponse(user, 200, req, res);
});

module.exports.login = async (req, res, next) => {

    const { email, password } = req.body;
    
    if (!email || !password)
        return next(new AppError('Please provide your email and password.', 400));
    
    const userData = await User.findOne({email}).select('+password');

    if (!userData)
        return next(new AppError('There is no user with this email!', 404));

    if (userData.comparePassword(password, userData.password)) {
        signTokenAndSendResponse(userData, 200, req, res);
    } else {
        next(new AppError('Wrong email or password.', 404));
    } 
}

module.exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token)
        return next(new AppError('You are not logged in! Please login'), 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(decoded.id);
        
    if (!user) 
        return next(new AppError('User was deleted!', 401));
    
    if(user.authenticatePasswordChangeTime(decoded.iat))
        return next (new AppError('Password was changed! Please login again', 401));
    req.user = user;
    next();
}

module.exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    
    if (!email)
        next(new AppError('please provide an email', 401));
    const userData = await User.findOne({ email });
    if (!userData)
        next(new AppError('there is no user with this email address', 401));
    
    const resetToken = User.createPasswordResetToken();
    User.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to ${resetUrl}`;
    
    try {
        await sendEmail({to:userData.email, subject:'Your password reset token is valid for 10 mins only!', text: message})
            res.status(200).json({
                status: 'success',
                message: 'reset token sent successfully'
            });
    } catch (error) {
        userData.passwordResetToken = undefined;
        userData.passwordResetTokenExpiry = undefined;
        await userData.save({ validateBeforeSave: false});
        return next(new AppError('there was an error sending the email, please try again later', 500));
    }
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
    
    const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTokenExpiry: { $gt: Date.now()}});
    
    if (!user) return next(new AppError('password reset token is invalid or expired', 401));
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();

    signTokenAndSendResponse(user, 200, req, res);
});

module.exports.authorize = (...roles) => {
    return catchAsync((req, res, next) => {
        if (roles.includes(req.user.role))
            next();
        return next(new AppError('User has no authority to this action', 403));
    });
}

module.exports.updatePassword = catchAsync(async (req, res, next) => {

    // send password and confirm it is matching with the password in the email using bcrypt
    const user = await User.findById(req.user._id).select('+password');
    const correct = await user.comparePassword(req.body.passwordCurrent, user.password)
    if (!correct)
        return next(new AppError('current password entered is wrong')); 
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();
    signTokenAndSendResponse(user, 200, req, res);
});

module.exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggingoutvalue', {
        maxAge: 1000,
        httpOnly: true
    });
    res.status(200).json({status: 'success'});
};