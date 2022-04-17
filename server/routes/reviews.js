const express = require('express');

const router = express.Router();

const reviewsController = require('../controllers/reviewsController.js');
const authController = require('../controllers/authController.js');

router.post('/:landlordId',
  authController.isAuthenticated,
  reviewsController.addReview,
  (req, res) => {
    return res.send('Review added successfully!');
  }
);

router.get('/',
  authController.isAuthenticated,
  reviewsController.getAllReviews,
  (req, res) => {
    res.status(200).json({ reviews: res.locals.reviews });
  }
);

router.get('/:reviewId',
  authController.isAuthenticated,
  reviewsController.getReviewById,
  (req, res) => {
    return res.type('application/json').json({ review: res.locals.review });
  }
);

router.put('/:reviewId',
  authController.isAuthenticated,
  reviewsController.updateReview,
  (req, res) => {
    return res.send('Post updated!');
  }
);

router.delete('/:reviewId',
  authController.isAuthenticated,
  reviewsController.deleteReview,
  (req, res) => {
    return res.send('Post deleted!');
  }
);

module.exports = router;
