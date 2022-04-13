const db = require("../models/BFLL.js");
const AppError = require('../util/AppError');

const reviewsController = {};

reviewsController.addReview = async (req, res, next) => {
  const {
    title,
    username,
    overall_rating,
    respect_rating,
    responsiveness_rating,
    bike_friendly,
    pet_friendly,
    description,
    user_id,
    landlord_id,
  } = req.body;

  const queryString = `
        INSERT INTO reviews (title, username, overall_rating, respect_rating, responsiveness_rating, bike_friendly, pet_friendly, description, user_id, landlord_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;

  try {
    const result = await db.query(queryString, [
      title,
      username,
      overall_rating,
      respect_rating,
      responsiveness_rating,
      bike_friendly,
      pet_friendly,
      description,
      user_id,
      landlord_id,
    ]);
    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'addReview', 500));
  }
};

reviewsController.getReviews = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const query = `
    SELECT * FROM reviews
    WHERE user_id = $1;
    `;

    const result = await db.query(query, [userId])
    res.locals.reviews = result.rows;
    next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'getReviews', 500));
  }
};

reviewsController.getAllLandlordReviews = async (req, res, next) => {
  const { landlordId } = req.params;
  // console.log('landlord id: ',landlord_id)
  const queryString = `
    SELECT * FROM reviews 
    WHERE landlord_id = $1
    ORDER BY created_at DESC;
  `;

  try {
    const results = await db.query(queryString, [landlordId]);
    res.locals.landlordReviews = results.rows;
    // console.log('landlord Reviews: ', results);
    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'getAllLandlordReviews', 500));
  }
};

reviewsController.updateReview = async (req, res, next) => {
  const { reviewId, title, description } = req.body;

  const queryString = `
    UPDATE reviews SET title = $2, description = $3 WHERE _id = $1;
  `;

  try {
    const result = await db.query(queryString, [reviewId, title, description]);
    console.log(result);
    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'updateReview', 500));
  }
};

reviewsController.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const queryString = `DELETE FROM reviews WHERE _id = $1;`;

  try {
    await db.query(queryString, [reviewId]);
    return next();
  } catch (error) {
    return next(new AppError(error, 'reviewsController', 'deleteReview', 500));
  }
};

module.exports = reviewsController;
