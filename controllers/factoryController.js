const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');

module.exports.createOne = (Model) => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: doc
        })
    });

module.exports.getAll = (Model) => 
    catchAsync(async (req, res, next) => {
        const docs = await Model.find();
       
        if (!docs)
            next(new AppError('No documents found', 404));
        
        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: docs
        });
    });

module.exports.getOne = (Model, populateOptions) => 
    catchAsync(async (req, res, next) => {
        const query = await Model.findById(req.params.id);
        
        if (populateOptions)
            query.populate(populateOptions);
        
        const doc = await query;
        
        if (!doc)
            next(new AppError('What you\'re searching for is not found',404));
        
        res.status(200).json({
            status: 'success',
            data: doc
       });
   });


module.exports.updateOne = (Model) => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{runValidators: true, new:true});
        
        if (!doc)
            next(new AppError('No document found with this id', 404));

        res.status(200).json({
            status: 'success',
            data: doc
        });
    });


module.exports.deleteOne = (Model) => 
    catchAsync(async (req, res, next) => {

        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc)
            next(new AppError('No document found with this id', 404));
        
        res.status(204).json({
        status: 'success',
        data: null
    })    
});
