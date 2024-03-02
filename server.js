const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');



process.on('uncaughtException', err => {
    console.log(err.name , err.message);
    console.log('Unhandled Exception, shutting down');
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASS);

mongoose.connect(DB).then(con => {
    console.log('db connection succesfful');
})

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`CORS-enabled App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name , err.message);
    console.log('Unhandled Rejection, shutting down');
    server.close(() => {
        process.exit(1);
    });
});


