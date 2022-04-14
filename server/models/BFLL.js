const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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