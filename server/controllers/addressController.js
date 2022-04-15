const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');

const addressController = {};

addressController.getUniqueCities = async (req, res, next) => {
    const queryString = `SELECT DISTINCT city FROM addresses;`;

    try {
        const results = await db.query(queryString);
        res.locals.cities = results.rows;
        return next();
    } catch (error) {
        return next(new AppError(error, 'addressController', 'getUniqueCities', 500));
    }
};

module.exports = addressController;