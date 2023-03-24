const Booking = require('../models/Booking');

// Função para contar reservas por data
exports.countBookingsByDate = async () => {
  try {
    const countByDate = await Booking.aggregate([
      {
        $group: {
          _id: "$booking_day",
          count: { $sum: 1 }
        }
      }
    ]);
    return countByDate;
  } catch (err) {
    console.error(err);
    throw new Error('Erro ao contar as reservas por data');
  }
};