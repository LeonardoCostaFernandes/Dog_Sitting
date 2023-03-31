const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const BookingConfig = require('../models/BookingConfig');

// @desc    Add a booking
// @route   POST /api/v1/bookingConfig
// @access  Private
exports.addBookingConfig = asyncHandler(async (req, res, next) => {
  // Verifica se o usuário que está fazendo a solicitação é um administrador
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Acesso não autorizado', 401));
  }

  // Cria uma nova instância do modelo BookingConfig com as informações fornecidas no corpo da solicitação
  const bookingConfig = new BookingConfig(req.body);

  try {
    // Salva a nova configuração de reserva no banco de dados
    const savedBookingConfig = await bookingConfig.save();
    res.status(201).json(savedBookingConfig);
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});