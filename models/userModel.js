const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('node:crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'name must be specified'],
        trim: true
    },
     email: {
        type: String,
        required: [true, 'email must be specified'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email ']
    },
     password: {
        type: String,
        min: [8,  'password length should be between 8 and 70 chars'],
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {validator: function (passConfirm) { return this.password === passConfirm } },
        message: 'password and confirm password are not the same'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    photo: {
        type: String,
        default: 'defaultAvatar.png'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default:Date.now()
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, process.env.BCRYPT_SALT);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.comparePassword = async function (userPassword, realPassword) {
    return await bcrypt.compare(userPassword, realPassword);
}

userSchema.methods.authenticatePasswordChangeTime =  function (iat) {
    if (this.passwordChangedAt)
    {
        const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        return iat < changeTime;
    }
    return false;
}

userSchema.methods.authorizeRole = async function (userPassword, realPassword) {
    return await bcrypt.compare(userPassword, realPassword);
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiry = Date.now() + 1000 * 60 * 10;
    return resetToken;
}


const User = mongoose.model('User', userSchema);

module.exports = User;