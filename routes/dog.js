const express = require('express');
const { addDog, getDogs } = require('../controllers/dogs');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, addDog)
  .get(protect, getDogs);

module.exports = router;



