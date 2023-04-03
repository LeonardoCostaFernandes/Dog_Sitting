const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const BookingConfig = require('../models/BookingConfig');

// @desc    Add a booking
// @route   POST /api/v1/bookingConfig
// @access  Admin
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
	} 
	catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});

// @desc    Update a booking configuration
// @route   POST /api/v1/bookingConfig/:id
// @access  Private/Admin
exports.updateBookingConfig = asyncHandler(async (req, res, next) => {
	// Verifica se o usuário que está fazendo a solicitação é um administrador
	if (req.user.role !== 'admin') {
		return next(new ErrorResponse('Acesso não autorizado', 401));
	}

	try {
		// Encontra a configuração de reserva com base no ID fornecido na URL
		const bookingConfig = await BookingConfig.findById(req.params.id);

		if (!bookingConfig) {
			return next(new ErrorResponse(`Não foi possível encontrar a configuração de reserva com ID ${req.params.id}`, 404));
		}

		// Atualiza os valores da configuração de reserva com base no corpo da solicitação
		bookingConfig.maximum_amount_of_bookings = req.body.maximum_amount_of_bookings;
		bookingConfig.valor_por_pernoite = req.body.valor_por_pernoite;
		bookingConfig.preco_diferenciado = req.body.preco_diferenciado;
		bookingConfig.dias_com_valor_diferente_do_padrao = req.body.dias_com_valor_diferente_do_padrao;

		// Salva a configuração de reserva atualizada no banco de dados
		const updatedBookingConfig = await bookingConfig.save();

		res.status(200).json(updatedBookingConfig);
	} 
	catch (error) {
		return next(new ErrorResponse(error.message, 500));
	}
});