const express = require('express');
const router = express.Router();

const reservationsRouter = require('./routes/reservations');


// Rota para listar todas as reservas
router.get('/', (req, res) => {
  // Lógica para buscar todas as reservas no banco de dados
  res.send('Listando todas as reservas');
});

// Rota para criar uma nova reserva
router.post('/', (req, res) => {
  // Lógica para criar uma nova reserva no banco de dados
  res.send('Criando uma nova reserva');
});

app.use('/reservations', reservationsRouter);


// Rota para atualizar uma reserva existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  // Lógica para atualizar a reserva com o ID informado no banco de dados
  res.send(`Atualizando a reserva com ID ${id}`);
});

// Rota para deletar uma reserva existente
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Lógica para deletar a reserva com o ID informado do banco de dados
  res.send(`Deletando a reserva com ID ${id}`);
});

module.exports = router;