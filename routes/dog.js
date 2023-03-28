const express = require('express');
const { addDog, getDogs, dogPhotoUpload, deleteDog } = require('../controllers/dogs');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route('/')
	.post(protect, addDog)
	.get(protect, getDogs);

router.route('/:id/photo').put(dogPhotoUpload);
  
router.route('/:id')
	.delete(protect, deleteDog);
module.exports = router;



