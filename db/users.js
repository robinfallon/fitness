/*
createUser
createUser({ username, password })
make sure to hash the password before storing it to the database
*/
async function createUser({ 
    username, 
    password,
     }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(id, username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);
  
      return user;
    } catch (error) {
      throw error;
    }
};

/*
getUser
getUser({ username, password })
this should be able to verify the password against the hashed password
*/ 
async function getUser({ username, password }) {
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT id, username, password, active
          FROM users
          WHERE id=${ userId }
        `);
      } catch (error) {
        throw error;
      }
};
