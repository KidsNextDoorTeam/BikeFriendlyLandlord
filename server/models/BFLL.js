const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.resolve(__dirname, '../../.env')});

const pool = new Pool({
    connectionString: process.env.PG_URI
  });

  module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback);
    }
  };