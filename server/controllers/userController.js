const bcrypt = require('bcryptjs');
const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');

const saltRounds = 10;

const userController = {};

/**
 * hashes the password with bcryptjs and saves the user to the database
 */
userController.createUser = async (req, res, next) => {
  // TODO: This controller will need to handle updating landlord and 
  // tenant tables depending how the user signs up
  try {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
    } = req.body;

    // TODO: validate user input

    const hashedPassword = await bcrypt.hash(password, saltRounds);


    /**
     * database query to add the new user to the users table
     */
    const userQueryString = `
    INSERT INTO users (first_name, last_name, username, email, password) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const userValues = [
      firstname,
      lastname,
      username,
      email,
      hashedPassword,
    ];
    const { rows: [user] } = await db.query(userQueryString, userValues);
    delete user.password;
    res.locals.user = user;

    return next();
  } catch (err) {
    return next(new AppError(err, 'userController', 'createUser', 500));
  }
};


// TODO: not tested
userController.deleteUser = async (req, res, next) => {
  try {
    // pull username form cookie

    const queryString = `
    Delete FROM users
    WHERE users._id = $1;
    `;
    const values = [
      /** userId */
    ];
    const result = await db.query(queryString, values);

    // res.locals.user = result.rows.something // !

    return next();
  } catch (err) {
    return next(new AppError(err, 'userController', 'deleteUser', 500));
  }
};

// TODO: Is this still needed? 
userController.getUserData = async (req, res, next) => {
  try {
    const userId = res.locals.user;

    const queryString = `
    SELECT * FROM users
    WHERE users._id = $1;
    `;

    const result = await db.query(queryString, [userId._id]);

    delete result.rows[0].password;

    res.locals.userData = result.rows[0];

    return next();
  } catch (error) {
    return next(new AppError(error, 'userController', 'getUserData', 500));
  }
};

module.exports = userController;
