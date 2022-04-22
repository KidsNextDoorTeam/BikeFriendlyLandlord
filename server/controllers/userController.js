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

userController.getUserData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const queryString = `
    SELECT * FROM users
    WHERE users._id = $1;
    `;

    const result = await db.query(queryString, [userId]);
    delete result.rows[0].password;

    res.locals.userData = result.rows[0];

    return next();
  } catch (error) {
    return next(new AppError(error, 'userController', 'getUserData', 500));
  }
};

userController.updateUserData = async (req, res, next) => {
  try {

    const { firstname, lastname, description, email, profilePic} = req.body;
    const { userId } = req.params;

    const queryString = `
    UPDATE users SET
    first_name = $1, last_name = $2, email = $3, description = $4, profile_pic = $5   
    WHERE users._id = $6 RETURNING first_name, last_name, email, description, profile_pic ;
    `;

    const result = await db.query(queryString, [firstname, lastname, email, description, profilePic, userId]);
    res.locals.userData = result.rows[0];

    return next();
  } catch (error) {
    return next(new AppError(error, 'userController', 'getUserData', 500));
  }
};

module.exports = userController;
