const express = require('express');
const { addDog, getDogs, dogPhotoUpload, deleteDog } = require('../controllers/dogs');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
	.post(protect, authorize('user','admin'),addDog)
	.get(protect,authorize('admin'),getDogs); //somente admin

router.route('/:id/photo')
.put(protect, authorize('user','admin'),dogPhotoUpload);
  
router.route('/:id')
	.delete(protect, authorize('user','admin'), deleteDog);
module.exports = router;



