const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Dog = require('../models/Dog');

// @desc    Add a dog
// @route   POST /api/v1/dogs
// @access  Private
exports.addDog = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  
  const dog = await Dog.create(req.body);
  
  res.status(201).json({
    success: true,
    data: dog
  });
});

// @desc    Get all dogs for a user
// @route   GET /api/v1/dogs
// @access  Private
exports.getDogs = asyncHandler(async (req, res, next) => {
  const dogs = await Dog.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: dogs
  });
});

// @desc    Delete dog
// @route   DELETE /api/v1/dogs/:id
// @access  Private
exports.deleteDog = asyncHandler(async (req, res, next) => {
  const dog = await Dog.findById(req.params.id);

  if (!dog) {
    return next(
      new ErrorResponse(`Dog not found with id of ${req.params.id}`, 404)
    );
  }

  // Verificar se o usuário logado é o mesmo que criou o registro
  if (dog.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this dog`, 401)
    );
  }

  await dog.remove();

  res.status(200).json({ success: true, data: {} });
});