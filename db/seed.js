// grab our client with destructuring from the export in index.js

const { 
    client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
} = require('./db'); 


//should call a query which drops all tables from our database:
async function dropTables() {
    try {
        console.log("Beginning to drop tables...");

      await client.query(`
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS users;
      `);

      console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; 
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

      await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            loggedIn BOOLEAN DEFAULT true
        );
        CREATE TABLE activities (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routines (
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        CREATE TABLE routine_activities (
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER,
            UNIQUE ("routineId", "activityId")
        );
      `);
      console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

async function createInitialUsers() {
    try {
      console.log("Starting to create users...");

      await createInitialUsers({
          id: "1",
          username: "lindsay",
          password: "lbf403",
      });

      await createInitialUsers({
          id: "2",
          username: "taylor",
          password: "trf526",
      });

      await createInitialUsers({
          id: "3",
          username: "julie",
          password: "jaf925",
      });
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
}

async function createRoutineActivities() {
    try {
        console.log("Starting routine activities...");
        
        await routineActivities({
            id: "1",
            routineId: 1,
            activityId: 1,
            duration: 50,
            count: 30,
        });
        console.log("Finished routine activities!");
    } catch(error) {
        console.log("Error creating routine activities!");
        throw error;
    }
}

async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createRoutineActivities();
    } catch (error) {
      throw error;
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers")
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]")
      const updateUserResult = await updateUser(users[0].id, {
        name: "new user",
        password: "new password"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  // close out the connection so it doesn't stall:
  .finally(() => client.end());