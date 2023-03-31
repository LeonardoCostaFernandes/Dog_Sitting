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
const bookingsRouter = require('./routes/booking');
const BookingConfig =require('./routes/bookingConfig');
//const {BookingConfig} = require('./models/BookingConfig');


// Load env vars (dotenv é usado para carregar as variáveis ​​de ambiente a partir do arquivo config.env)
dotenv.config({ path: './config/config.env' });
//connectDB é chamada para conectar-se ao banco de dados.
connectDB();

//cria uma instância do Express 
const app = express();

// Body parser - usa a função json() para analisar o corpo das solicitações.
app.use(express.json());

// Cookie parser - usada para analisar os cookies e fileupload() é usada para lidar com uploads de arquivos.
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder - usada para configurar o diretório público, que é usado para servir arquivos estáticos, como imagens do Public
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/dogs', dogsRouter);

app.use('/api/v1/bookings', bookingsRouter);

app.use('/api/v1/bookingConfig', BookingConfig);

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