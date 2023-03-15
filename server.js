const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const colors = require('colors');
const fileupload = require('express-fileupload');

const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const dogsRouter = require('./routes/dog');
const bookingsRouter = require('./routes/bookings');
//const reservationsRouter = require('./routes/reservations');



// Load env vars
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dogs', dogsRouter);
app.use('/api/v1/bookings', bookingsRouter);

//app.use('/api/v1/reservations', reservationsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});