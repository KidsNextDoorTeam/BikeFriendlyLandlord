const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.resolve(__dirname, '../../.env')});
// psql -d 'postgres://rrcpylzw:zVk-zK5ReIhNvZpiZQe6abSJvG-FML8u@rajje.db.elephantsql.com/rrcpylzw' -f schema.sql

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'staging' ? process.env.PG_URI_STAGING : process.env.PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('Executing: ', text);
    return pool.query(text, params, callback);
  },
  connect: async () => {
    return await pool.connect();
  }
};