const { Client } = require('pg'); // imports the pg module (node's postgresql adapter)

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/fitness-dev');

async function createUser({ 
    id,
    username, 
    password,
     }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(id, username, password) 
        VALUES($1, $2, $3) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [id, username, password]);
  
      return user;
    } catch (error) {
      throw error;
    }
};

async function getUserById(userId) {
    try {
      const { rows: [ user ] } = await client.query(`
        SELECT id, username, password, active
        FROM users
        WHERE id=${ userId }
      `);
    } catch (error) {
      throw error;
    }
}

async function getAllUsers() {
    try {
      const { rows } = await client.query(`
        SELECT id, username, password, active 
        FROM users;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
}

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
  // Each key in the fields object should match a column name for our table:
    try {
      const { rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
  ...require('./client'), // re-export client for use in our server file
  ...require('./users'), // adds key/values from users.js
  ...require('./activities'), // adds key/values from activites.js
  ...require('./routines'), // etc
  ...require('./routine_activities') // etc
};

