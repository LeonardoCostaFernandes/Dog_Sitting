const mongoose = require('mongoose');
const BookingConfigSchema = new mongoose.Schema({
  maximum_amount_of_bookings: {
  type: Number
  },
  valor_por_pernoite: {
   type: Number
  },
  preco_diferenciado:{
   type: Number
  },
  dias_com_valor_diferente_do_padrao: {
   type: [Date]
  },
 });
module.exports = mongoose.model('BookingConfig', BookingConfigSchema);
