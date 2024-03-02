const AppError = require('../utilities/AppError');

const handleCastErrorDB = err => {
    const message = `invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `duplicate field value: ${value}, please use a unique value`
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errorsMessages = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errorsMessages.join(' ,')}`
    return new AppError(message, 400);
}



const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status:err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })    
} 

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status:err.status,
            message: err.message,
        })
    }
    
    console.error('error occurred', err);
    res.status(500).json({
        status: 'error',
        message: 'something went WRONG!'
    })
} 

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        const { error } =  { err };
        if (error.name === 'CastError') 
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        // if (error.name === 'MongoServerError')
        //     error = handleUnhandledRejection(error);    
        
        
        sendErrorProd(error, res);
    }

    
}