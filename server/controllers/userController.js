const bcrypt = require('bcryptjs');
const db = require('../models/BFLL.js');
const format = require('pg-format');
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

    const roles = [[user._id, 3]];
    if (isLandlord) roles.push([[user._id, 2]]);

    const roleQuery = format('INSERT INTO user_roles VALUES %L;', roles);
    await client.query(roleQuery);
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

userController.getUserData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userQuery = {
      text: `
      SELECT first_name, last_name, username, email, profile_pic, description 
      FROM users WHERE _id = $1;
      `, 
      values: [id],
    };

    const roleQuery = {
      text: `
      SELECT role FROM user_roles ur 
      LEFT JOIN roles r ON  r.id = ur.role_id
      WHERE ur.user_id = $1;
      `,
      values: [id],
    };

    const {rows: [user]} = await db.query(userQuery);
    const { rows: roles } = await db.query(userQuery);
    user.roles = roles;
    delete user.password;

    res.locals.userData = user;

    return next();
  } catch (error) {
    return next(new AppError(error, 'userController', 'getUserData', 500));
  }
};

module.exports = userController;
