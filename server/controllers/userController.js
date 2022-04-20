const bcrypt = require('bcryptjs');
const db = require('../models/BFLL.js');
const AppError = require('../util/AppError');
const SqlError = require('../util/SqlError.js');

const saltRounds = 10;

const userController = {};

/**
 * hashes the password with bcryptjs and saves the user to the database
 */
userController.createUser = async (req, res, next) => {
  const {
    username,
    password,
    firstname,
    lastname,
    email,
    isLandlord,
    petFriendly,
    bikeFriendly,
  } = req.body;

  if (!username || !password || !firstname || !lastname || !email) {
    return next(new AppError(
      new Error('Expected username, password, firstname, lastname email and isLandlord to exist on req.body',
        'userController', 'createUser', 400
      ))
    );
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // TODO: Add cascade to foreign key relationshp ON DELETE CASCADE
  const client = await db.connect();
  const userQuery = {
    text: `
      INSERT INTO users (first_name, last_name, username, email, password) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    values: [
      firstname,
      lastname,
      username,
      email,
      hashedPassword,
    ]
  };

  try {
    client.query('BEGIN');
    const { rows: [user] } = await client.query(userQuery);
    delete user.password;
    res.locals.user = user;

    // TODO: User roles query

    // If they're a landlord add them to the landlords table as well
    if (isLandlord) {
      if (
        !Object.prototype.hasOwnProperty.call(req.body, 'bikeFriendly') ||
        !Object.prototype.hasOwnProperty.call(req.body, 'petFriendly')
      ) {
        return next(new AppError(
          new Error('Expected bikeFriendly, petFriendly to exist on req.body',
            'userController', 'createUser', 400
          ))
        );
      }

      const addLandlordQuery = {
        text: 'INSERT into landlords (_id, bike_friendly, pet_friendly) VALUES ($1, $2, $3);',
        values: [user._id, petFriendly, bikeFriendly]
      };

      client.query(addLandlordQuery);
    }
    client.query('COMMIT');
    return next();

  } catch (err) {
    client.query('ROLLBACK');
    if (Object.prototype.hasOwnProperty.call(err, 'schema')) {
      return next(new SqlError(err, 'userController', 'createUser', 409));
    }
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
