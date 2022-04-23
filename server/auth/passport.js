const LocalStrategy = require('passport-local');
const db = require('../models/BFLL');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  passport.use(new LocalStrategy(async (username, password, cb) => {
    try {
      const { rows: [user] } = await db.query('SELECT * FROM users where username = $1;', [username]);
      if (!user._id) {
        return cb(null, false, { message: 'Incorrect username or password' });
      }
      const match = await bcrypt.compare(password, user.password);
      delete user.password;
      const { rows: roles } = await db.query(
        'SELECT r.role FROM user_roles u LEFT JOIN roles r ON u.role_id = r._id WHERE u.user_id = $1;',
        [user._id]
      );
      console.log('rolling');
      user.roles = roles.map(role => role.role);
      if (match) return cb(null, {
        ...user
      });
      return cb(null, false, { message: 'Incorrect username or password' });
    } catch (error) {
      console.log('ERROR: Could not find user when creating a passport strategy');
      return cb(error);
    }

  }));

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      // full user object stored on req.user by verify function
      // this stores object on req.session.passport.user so we can associate sessions with users 
      done(null, user._id);
    });
  });

  passport.deserializeUser((id, cb) => {
    process.nextTick(async () => {
      try {
        const { rows: [userData] } = await db.query('SELECT * from users where _id = $1', [id]);
        delete userData.password;
        const { rows: roles } = await db.query(
          'SELECT r.role FROM user_roles u LEFT JOIN roles r ON u.role_id = r._id WHERE u.user_id = $1;',
          [userData._id]
        );
        userData.roles = roles.map(role => role.role);
        cb(null, userData);
      } catch (error) {
        console.log('error deserializing');
        return cb(error);
      }
    });
  });
};