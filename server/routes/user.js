const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/:userId', authController.isAuthenticated, userController.getUserData, (req, res) => {
  res.status(200).json({user: res.locals.userData});
});

router.put('/:userId/updateUserInfo', userController.updateUserData, (req, res) => {
  res.status(200).json(res.locals);
});

router.get('/:userId/reviews', authController.isAuthenticated, reviewsController.getReviewsByUser, (req, res) => {
  res.status(200).json({ reviews: res.locals.reviews });
});

module.exports = router;