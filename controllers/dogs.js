const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Dog = require('../models/Dog');
const path = require('path');

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
	const dogs = await Dog.find();
	
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
	console.log('dog:', dog);
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

	await dog.deleteOne();

	res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for dog
// @route     PUT /api/v1/dog/:id/photo
// @access    Private
exports.dogPhotoUpload = asyncHandler(async (req, res, next) => {
	console.log(req.params.id);
	const dog = await Dog.findById(req.params.id);
	console.log(dog);
	if (!dog) {
		return next(
			new ErrorResponse(`Dog not found with id of ${req.params.id}`, 404)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}

	// Check filesize
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}
	
	
	// Create custom filename
	file.name = `photo_${dog._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Dog.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name
		});
	});
  
});