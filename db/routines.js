const { Client } = require("./client"); //import ./client module

async function getAllRoutines() {
    // select and return an array of all routines, include their activities:
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM routines;
        `);
        return rows;
    } catch(error) {
        console.log(error);
        throw error;
    }
};

async function getPublicRoutines() {
    // select and return an array of public routines, include their activities:
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM routines 
        WHERE public = true
        `);
      console.log(rows)
        return rows;
    } catch(error) {
        throw error;
    }
};

async function getAllRoutinesByUser({ username }) {
    // select and return an array of all routines made by user, include their activities:
    try {
        const { routines } = await client.query(`
        SELECT * 
        FROM routines 
        WHERE id = ${ username }
        JOIN routine_activities."routineId" 
        ON routines.id
        `);
        return routines;
    } catch(error) {
        console.log(error);
        throw error;
    }
};

async function getPublicRoutinesByUser({ username }) {
    // select and return an array of public routines made by user, include their activities:
    try {
        const { rows: publicRoutines } = await client.query(`
        SELECT name 
        FROM routines 
        WHERE public = true;
        `);
        return publicRoutines;
    } catch(error) {
        console.log(error);
        throw error;
    }
};

async function getPublicRoutinesByActivity({ activityId }) {
    /* select and return an array of public routines which have a specific activityId 
    in their routine_activities join, include their activities: */
    try {
        const { rows: publicRoutines } = await client.query(`
        SELECT name.id 
        FROM routines 
        WHERE public = true
        JOIN
        `);
    } catch (error) {
        throw error;
    }
};

async function createRoutine({ creatorId, public, name, goal }) {
    // create and return the new routine:
    try {
        const { rows: routine } = await client.query(`
            INSERT INTO routines("creatorId", public, name, goal)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        ` [creatorId, public, name, goal]);
        
        const activityList = await createActivities(activities);

        return await addActivitiesToRoutine(routine.id, activityList);
    } catch(error) {
      throw error;
    }
}

async function updateRoutine({ id, fields }) {
    // Find the routine with id equal to the passed in id
    // Don't update the routine id, but do update the public status, name, or goal, as necessary
    // Return the updated routine:

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const {
            rows: routine_activities,
        } = await client.query(`
                UPDATE routine_activities
                SET ${ setString }
                WHERE id=${ id }
                RETURNING *;
            `, Object.values(fields)
            );
        
        return routine_activities;

    } catch(error) {
      throw error;
    }
};

module.exports = {
    getAllRoutines,
    getPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
};