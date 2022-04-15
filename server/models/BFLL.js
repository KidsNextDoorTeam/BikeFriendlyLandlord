const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.resolve(__dirname, '../../.env')});
// psql -d 'postgres://rrcpylzw:zVk-zK5ReIhNvZpiZQe6abSJvG-FML8u@rajje.db.elephantsql.com/rrcpylzw' -f schema.sql

const pool = new Pool({
    connectionString: process.env.PG_URI
  });

  module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback);
    }
  };