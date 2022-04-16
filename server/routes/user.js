const express = require('express');
const userController = require('../controllers/userController.js');
const sessionController = require('../controllers/sessionController.js');
const reviewsController = require('../controllers/reviewsController');



const router = express.Router();

router.get('/getUser', sessionController.checkSession, userController.getUserData, (req, res) => {

  res.status(200).json(res.locals.userData);
});

router.get('/:userId/reviews', sessionController.checkSession, reviewsController.getReviewsByUser, (req, res) => {
  res.status(200).json({ reviews: res.locals.reviews });
});

module.exports = router;