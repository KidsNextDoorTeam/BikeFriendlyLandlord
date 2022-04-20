const express = require('express');

const router = express.Router();

const reviewsController = require('../controllers/reviewsController.js');
const sessionController = require('../controllers/sessionController.js');

router.post('/:landlordId',
  sessionController.checkSession,
  reviewsController.addReview,
  (req, res) => {
    return res.send('Review added successfully!');
  }
);

router.get('/',
  sessionController.checkSession,
  reviewsController.getAllReviews,
  (req, res) => {
    res.status(200).json({ reviews: res.locals.reviews });
  }
);

router.get('/:reviewId',
  sessionController.checkSession,
  reviewsController.getReviewById,
  (req, res) => {
    return res.type('application/json').json({ review: res.locals.review });
  }
);

router.put('/:reviewId',
  sessionController.checkSession,
  reviewsController.updateReview,
  (req, res) => {
    return res.send('Post updated!');
  }
);

router.delete('/:reviewId',
  sessionController.checkSession,
  reviewsController.deleteReview,
  (req, res) => {
    return res.send('Post deleted!');
  }
);

module.exports = router;
