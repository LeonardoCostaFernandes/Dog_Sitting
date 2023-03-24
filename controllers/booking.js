const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Dog = require('../models/Dog');



// @desc    Add a booking
// @route   POST /api/v1/bookings
// @access  Private
exports.addBooking = asyncHandler(async (req, res, next) => {
  const { id_dog, booking_day, user } = req.body;

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
  const bookingDate = new Date(booking_day);

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
  const existingBookingsCount = await Booking.countDocuments({
    booking_day: { $in: booking_day }
  });

  console.log('existingBookingsCount:', existingBookingsCount);
  console.log(booking_day, "dia requisitado para reservar");

  // Verifica se a soma das reservas existentes e a reserva que está sendo adicionada
  // é maior ou igual a 10
  if (existingBookingsCount + booking_day.length >= 11) {
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
  await booking.deleteOne();

  console.log('Booking deleted');

  res.status(200).json({ success: true, data: {} });
});