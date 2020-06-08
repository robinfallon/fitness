const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost:5432/juicebox-dev');

const apiRouter = require('./api');
server.use('/api', apiRouter);

    // create a new routine_activity, and return it
async function addActivityToRoutine({ routineId, activityId, count, duration }) {
    try {
        const createRoutineActivityPromises = activityList.map(
            activity => createRoutineActivity(fields)
        );

        await Promise.all(createRoutineActivityPromises);

        return await getRoutineById(routineId);
    } catch (error) {
      throw error;
    }
};

updateRoutineActivity({ id, fields = {} })
    /* Find the routine with id equal to the passed in id
    Update the count or duration as necessary */
        //'tags' is a key & an array:
    const { users } = fields;
    delete fields.users;
    
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
    try {
        if (setString.length > 0) {
            await client.query(`
              UPDATE routine_activities
              SET ${ setString }
              WHERE id=${ routineId }
              RETURNING *;
            `, Object.values(fields));
        }

        if (users === undefined) {
            return await getRoutineActivityById(routineId);
        }

        const activityList = await createUsers(users);
        const userListIdString = activityList.map(
            user => `${ user.id }`
        ).join(', ');

        await client.query(`
            DELETE FROM routine_users
            WHERE "userId"
            NOT IN (${ userListIdString })
            AND "routineId"=$1;
        `, [routineId]);

        await addActivityToRoutine(routineId, activityList);

        return await getRoutineActivityById(routineId);
    } catch(error) {
        throw error;
};

async function destroyRoutineActivity(id) {
    // remove routine_activity from database
    const { tags } = id;
    delete id.tags;
};
