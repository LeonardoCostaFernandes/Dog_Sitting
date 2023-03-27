const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Dog = require('../models/Dog');
const amountOfDogs = require('../config/amountOfDogs');


//https://www.mongodb.com/docs/manual/core/aggregation-pipeline/

// @desc    Add a booking
// @route   POST /api/v1/bookings
// @access  Private
exports.addBooking = asyncHandler(async (req, res, next) => {
  console.log("req.body",req.body);

  const { id_dog, booking_day, user } = req.body;
  console.log("booking_day", booking_day);


  // Verifica se o id_dog existe na coleção Dogs
  const dog = await Dog.findById(id_dog);
  if (!dog) {
    return res.status(404).json({ error: 'Não foi possível encontrar o cão solicitado' });
  }

  // Verifica se o user é igual ao user registrado na coleção Dogs com o id_dog pesquisado
  if (dog.user.toString() !== user) {
    return res.status(400).json({ error: 'O usuário que está fazendo a reserva não é o proprietário do cachorro' });
  }

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




const bookingDate = new Date(req.body.booking_day[0]);
  console.log("bookingDate", bookingDate);

  // Verifica se a data da reserva é maior que a data atual
  if (bookingDate.getTime() <= currentDate.getTime()) {
    console.log('Não é possível realizar o booking para a data selecionada');
    return res.status(400).json({ error: 'Não é possível realizar o booking para a data selecionada, escolha uma data posterior ao dia de hoje' });
  }

  // Verifica se já existe uma reserva para o mesmo cachorro e mesma data
  const existingBooking = await Booking.findOne({ id_dog: id_dog, booking_day: booking_day });
  if (existingBooking) {
    console.log('Já existe uma reserva para esse cachorro nessa data');
    return res.status(400).json({ error: 'Já existe uma reserva para esse cachorro nessa data' });
  }

  // Verifica quantas reservas já existem para o dia informado
  const existingBookingsCount = await Booking.countDocuments({id_dog: { $eq: id_dog }, booking_day: { $eq: booking_day }
  });

  console.log('existingBookingsCount:', existingBookingsCount);
  console.log(booking_day, "dia requisitado para reservar");

  // Verifica se a soma das reservas existentes e a reserva que está sendo adicionada
  // é maior ou igual ao número máximo de cães permitidos
  if (existingBookingsCount + 1 > amountOfDogs) {
    console.log('Não é possível realizar o booking por indisponibilidade de espaço');
    return res.status(400).json({ error: 'Não é possível realizar o booking por indisponibilidade de espaço' });
  }

  const booking = new Booking({
    id_dog,
    booking_day,
    user
  });

  const savedBooking = await booking.save();

  console.log('savedBooking:', savedBooking);

  res.status(201).json({
    success: true,
    data: savedBooking
  });
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
// @route   GET /api/v1/bookings/:date
// @access  Public
exports.getAllBookingsByDate = asyncHandler(async (req, res, next) => {
  /**
   * @param {string} req.params.date - The date in format 'YYYY-MM-DD'
   */
  const date = new Date(req.params.date);

  const bookings = await Booking.aggregate([
    { $match: { booking_day: { $eq: date } } },
    { $group: { _id: "$booking_day", count: { $sum: 1 } } }
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
  const startDate = new Date(req.params.startDate);
  const endDate = new Date(req.params.endDate);

  const bookings = await Booking.find({
    booking_day: {
      $gte: startDate,
      $lte: endDate
    }
  });

  const bookingDays = bookings.map(booking => booking.booking_day.toISOString().slice(0, 10));
  
  // Inicializa um objeto para armazenar as contagens
  const counts = {};
  
  // Atualiza as contagens para cada data
  bookingDays.forEach(date => {
    counts[date] = counts[date] ? counts[date] + 1 : 1;
  });
  
  // Cria um array de objetos com as contagens para cada data
  const result = Object.keys(counts).map(date => ({ booking_day: new Date(date), count: counts[date] }));

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

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  const { booking_day } = req.body;
  const currentDate = new Date();
  const newBookingDate = new Date(booking_day);
  console.log("newBookingDate", newBookingDate);
  console.log('existingBookingsCount:', booking.existingBookingsCount);

  // Verifies if the booking day is a valid date
  if (isNaN(Date.parse(booking_day))) {
    return res.status(400).json({ error: 'Invalid date' });
  }

  // Verifies if the new booking date is greater than the current date
  if (newBookingDate.getTime() <= currentDate.getTime()) {
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
  if (existingBookingsCount + 1 > amountOfDogs) {
    return res.status(400).json({ error: 'Cannot book due to lack of space' });
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { booking_day: newBookingDate },
    { new: true, runValidators: true }
  );

  console.log("req.params.id", req.params.id);

  res.status(200).json({ success: true, data: updatedBooking });
});
