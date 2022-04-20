const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/getUser', authController.isAuthenticated, userController.getUserData, (req, res) => {

  res.status(200).json(res.locals.userData);
});

router.get('/:userId/reviews', authController.isAuthenticated, reviewsController.getReviewsByUser, (req, res) => {
  res.status(200).json({ reviews: res.locals.reviews });
});

module.exports = router;