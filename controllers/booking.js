const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Dog = require('../models/Dog');
const {config} = require('../config/maximum_amount_of_bookings');


// @desc    Add a booking
// @route   POST /api/v1/bookings
// @access  Private
exports.addBooking = asyncHandler(async (req, res, next) => {
 console.log("req.body",req.body);
 const { id_dog, booking_day } = req.body;
 console.log("booking_day", booking_day);

 // Verifica se o id_dog existe na coleção Dogs
 const dog = await Dog.findById(id_dog);
 if (!dog) {
  return res.status(404).json({ error: 'Não foi possível encontrar o cão solicitado' });
 }
/*
 // Verifica se o user é igual ao user registrado na coleção Dogs com o id_dog pesquisado
 if (dog.user.toString() !== user) {
  return res.status(400).json({ error: 'O usuário que está fazendo a reserva não é o proprietário do cachorro' });
 }
*/
 const currentDate = new Date();
 console.log("currentDate",currentDate)

 // Validating booking_day parameter to ensure that it is a valid date
 for (let i = 0; i < booking_day.length; i++) {
  const currentBookingDay = booking_day[i];
  if (isNaN(Date.parse(currentBookingDay))) {
   console.log(`A data da reserva (${currentBookingDay}) é inválida`);
   return res.status(400).json({ error: `A data da reserva (${currentBookingDay}) é inválida` });
  }
 }

 // Validando o parâmetro booking_day para garantir que todas as datas sejam válidas e sejam posteriores à data de hoje
 for (let i = 0; i < req.body.booking_day.length; i++) {
  const bookingDate = new Date(req.body.booking_day[i]);
  console.log(`Booking Date ${i}:`, bookingDate);
   
  // Verifica se a data da reserva é maior que a data atual
  if (bookingDate.getTime() <= currentDate.getTime()) {
  console.log(`Não é possível realizar o booking para a data ${bookingDate}`);
  return res.status(400).json({ error: `Não é possível realizar o booking para a data ${bookingDate}, escolha uma data posterior ao dia de hoje` });
  }
 }

 //adicionando um valor para as reservas realizadas
 let totalDays = 0;
	let totalPrice =0;
 for (let i = 0; i < booking_day.length; i++) {
   const currentBookingDay = booking_day[i];
   //const bookingDate = new Date(currentBookingDay);
   if (config.dias_com_valor_diferente_do_padrao.includes(currentBookingDay)) {
   totalDays++;
			totalPrice = (config.preco_diferenciado * totalDays)
  } 
  else {
			totalDays++;
			totalPrice = (config.valor_por_pernoite * totalDays)
  }

 }

 // Verifica se a soma das reservas existentes e a reserva que está sendo adicionada para cada data individualmente
 for (const day of booking_day) {
  const existingBookingsCount = await Booking.countDocuments({
  booking_day: { $eq: day }
  });
  console.log("booking_day", booking_day);
  console.log(`existingBookingsCount for ${day}:`, existingBookingsCount);
   
  //avaliando o tipo 
  console.log(typeof existingBookingsCount );
  console.log(typeof config.maximum_amount_of_bookings );

  // Verifica se a soma das reservas existentes e a reserva que está sendo adicionada é maior ou igual ao número máximo de cães permitidos
  if (existingBookingsCount + 1 > config.maximum_amount_of_bookings) {
   console.log(`Não é possível realizar o booking para o dia ${day} por indisponibilidade de espaço`);
   return res.status(400).json({ error: `Não é possível realizar o booking para o dia ${day} por indisponibilidade de espaço` });
  }
  console.log("maximum_amount_of_bookings", config.maximum_amount_of_bookings);
   
  if (existingBookingsCount + 1 > config.maximum_amount_of_bookings) {
   break;
  }
  }

 const booking = new Booking({
  id_dog,
  booking_day,
 
 });
 const savedBooking = await booking.save();
 console.log('savedBooking:', savedBooking);

 if (savedBooking) {
  //const totalPrice = totalDays * config.valor_por_pernoite;
 	res.status(201).json({
			success: true,
			message: `A reserva foi concluída com sucesso para ${totalDays} dia(s). O preço total é € ${totalPrice}.`,
			data: savedBooking,
 });
	} else {
		return res.status(500).json({ error: 'Houve um erro ao salvar a reserva.' });
	};
});

// @desc    Get all bookings for a user
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
 const bookings = await Booking.find({ user: req.user.id });
 console.log('bookings:', bookings);
 res.status(200).json({
  success: true,
  data: bookings
 });
});

// @desc      Get all bookings
// @route     GET /api/v1/bookings/all
// @access    Public
exports.getAllBookings = asyncHandler(async (req, res, next) => { 
 const bookings = await Booking.find();
 res.status(200).json({
  success: true,
  data: bookings
 });
});

// @desc    Get all bookings for a specific date with day counter
// @route   GET /api/v1/bookings/byOneDate/:startDate
// @access  Public
exports.getAllBookingsByDate = asyncHandler(async (req, res, next) => {
 /**
  * @param {string} req.params.date - The date in format 'YYYY-MM-DD'
  */
 const date = new Date(req.params.startDate);
 const bookings = await Booking.aggregate([
  { $match: { booking_day: { $eq: date } } },
  { $group: { _id: "$booking_day", count: { $sum: 1 }, bookings: { $push: "$$ROOT" } } },
  { $project: { _id: 0, booking_day: "$_id", count: 1, bookings: 1 } }
 ]);
 console.log('bookings:', bookings);

 res.status(200).json({
  success: true,
  data: bookings
 });
});

// @desc    Get all bookings between two dates com contador
// @route   GET /api/v1/bookings/:startDate/:endDate
// @access  Public
exports.getAllBookingsBetweenDates = asyncHandler(async (req, res, next) => {
 try {
  const startDate = new Date(req.params.startDate);
  const endDate = new Date(req.params.endDate);

  const bookings = await Booking.find({
   booking_day: {
    $gte: startDate,
    $lte: endDate
   }
  });

  const bookingDays = bookings.map(booking => {
   const bookingDate = new Date(booking.booking_day);
   return bookingDate.toISOString().slice(0, 10);
  });

  // Inicializa um objeto para armazenar as contagens
  const counts = {};

  // Atualiza as contagens para cada data
  bookingDays.forEach(date => {
   counts[date] = counts[date] ? counts[date] + 1 : 1;
  });

  // Cria um array de objetos com as contagens para cada data
  const result = Object.keys(counts).map(date => ({
   booking_day: new Date(date),
   count: counts[date]
  }));

  console.log('bookings:', bookings);
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('req.params.startDate:', req.params.startDate);
  console.log('req.params.endDate:', req.params.endDate);
  console.log('bookingDays:', bookingDays);

  res.status(200).json({
   success: true,
   data: result
  });
 }catch (error) {
  // Se ocorrer um erro, envie uma resposta de erro com uma mensagem apropriada
  res.status(500).json({
   success: false,
   error: 'Ocorreu um erro ao buscar as reservas.'
  });
 }
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
 const booking = await Booking.findById(req.params.id);

 console.log('booking:', booking);

 if (!booking) {
  return next(
   new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  ); 
 }
 if (booking.user.toString() !== req.user.id) {
  return next(
   new ErrorResponse(`Not authorized to delete this booking`, 401)
  );
 }
  
 await booking.deleteOne();;

 console.log('Booking deleted');

 res.status(200).json({ success: true, data: {} });
});


// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
 const booking = await Booking.findById(req.params.id);
 console.log("req.params.id",req.params.id);
 if (!booking) {
  return next(
   new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
  );
 }

 const { booking_day } = req.body;
	const currentDate = new Date();
 
 // Verifies if the booking day is a valid date
 if (isNaN(Date.parse(booking_day))) {
  console.log("booking_day", booking_day);
  return res.status(400).json({ error: 'Invalid date' });
	}

	console.log("booking_day", booking_day);
 // Verifies if the new booking date is greater than the current date
 const newBookingDate = new Date(booking_day);
 console.log("newBookingDate", newBookingDate);
 if (newBookingDate.getTime() < currentDate.getTime()) {
  return res.status(400).json({ error: 'Cannot book for the selected date, choose a date after today' });
 }

 // Counts how many bookings already exist for the selected date, excluding the current booking
 const existingBookingsCount = await Booking.countDocuments({
  $and: [
   { id_dog: { $eq: booking.id_dog } },
   { booking_day: { $eq: newBookingDate } },
   { _id: { $ne: req.params.id } }
  ]
 });

 console.log(newBookingDate, "requested date for booking");

 // Verifies if the sum of existing bookings and the booking being updated is greater than the maximum allowed
 if (existingBookingsCount >= config.maximum_amount_of_bookings) {
  return res.status(400).json({ error: 'Cannot book due to lack of space' });
 }

 // Updates the booking day field of the booking
 booking.booking_day = [booking_day];
 const savedBooking = await booking.save();

 res.status(200).json({
  success: true,
  data: savedBooking
 });
});


// @desc    Get all available booking dates
// @route   GET /api/v1/bookings/available/:startDate/:endDate
//http://localhost:4000/api/v1/bookings/available/start_date=24-04-01&end_date=24-04-03
// @access  Public
exports.allDatesOpenForBooking = asyncHandler(async (req, res, next) => {
	try {
		/**
			* @param {string} req.params.startDate - The date in format 'YYYY-MM-DD'
			* @param {string} req.params.endDate - The date in format 'YYYY-MM-DD'
			*/

		const startDate = new Date(req.params.startDate);
		const endDate = new Date(req.params.endDate);
		console.log(typeof startDate );
		console.log(typeof endDate );
		console.log("startDate", startDate);
		console.log("endDate", endDate);

		// Verifica se as datas de início e fim são válidas
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			console.log("Invalid start or end date");
			return res.status(400).json({
				error: 'As datas de início e/ou fim são inválidas'
			});
		}

		// Verifica se a data de início é menor ou igual à data de fim
		if (startDate > endDate) {
			console.log("Start date is after end date");
			return res.status(400).json({
				error: 'A data de início deve ser anterior ou igual à data de fim'
			});
		}

     
		//const bookingDays = {};

		// Busca todas as reservas dentro do intervalo de datas
		const bookings = await Booking.find({
			booking_day: {
				$gte: startDate,
				$lte: endDate 
			}
		});

		console.log('bookings:', bookings);

		// Conta quantas reservas há para cada dia dentro do intervalo de datas
		const bookingDays = bookings.map(booking => {
			const bookingDate = new Date(booking.booking_day);
			return bookingDate.toISOString().slice(0, 10);
		});

		// Inicializa um objeto para armazenar as contagens
  const counts = {};
		// Atualiza as contagens para cada data
  for (const date of bookingDays) {
			counts[date] = (counts[date] || 0) + 1;
		}
		console.log('bookingDays:', bookingDays);

		// Calcula o número de vagas disponíveis em cada dia
		const totalSlots = config.maximum_amount_of_bookings; // número total de vagas disponíveis por dia
		const availableSlots = {};
		for (const date of Object.keys(counts)) {
			availableSlots[date] = totalSlots - counts[date];
		}

		// Adiciona os dias sem reservas ao objeto counts com vagas disponíveis iguais ao total de vagas
		const currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			const currentDateString = currentDate.toISOString().slice(0, 10);
			if (!(currentDateString in counts)) {
				counts[currentDateString] = 0;
				availableSlots[currentDateString] = totalSlots;
			}
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Cria um array de objetos com as contagens para cada data
		const result = Object.keys(counts).map(date => ({
			booking_day: new Date(date),
			count: counts[date],
			"vagas disponíveis": availableSlots[date]
		}));

		console.log('bookings:', bookings);
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('req.params.startDate:', req.params.startDate);
  console.log('req.params.endDate:', req.params.endDate);
  console.log('bookingDays:', bookingDays);
		
		// Ordena o resultado por datas crescentes
		result.sort((a, b) => a.booking_day - b.booking_day)
		
		res.status(200).json({
			success: true,
			data: result
		});
	} 
	catch (error) {
		// Se ocorrer um erro, envie uma resposta de erro com uma mensagem apropriada
		console.log("Error:", error.message);
		res.status(500).json({
			success: false,
			error: 'Ocorreu um erro ao buscar as reservas.'
		});
	}
});

// @desc    Approve or reject a booking
// @route   PUT /api/v1/bookings/approve/:id
// @access  Private/Admin
exports.bookingApprover = asyncHandler(async (req, res, next) => {
	const booking = await Booking.findById(req.params.id);

	if (!booking) {
		console.log(`Booking not found with id of ${req.params.id}`);
		return next(
			new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
	}

	if (booking.booking_status !== 'pending') {
		console.log(`reserva não PENDING`);
		return next(
			new ErrorResponse('Esta reserva já foi aprovada/rejeitada', 400));
	}

	booking.booking_status = req.body.booking_status;

	const updatedBooking = await booking.save();
	console.log(`reserva aprovada com sucesso`);
	res.status(200).json({
		success: true,
		data: updatedBooking
	});
});