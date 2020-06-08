
async function getAllActivities() {
    // select and return an array of all activities:
    try {
        const { rows } = await client.query(`
          SELECT id, name, description 
          FROM activities;
        `);
    
        return rows;
      } catch (error) {
        throw error;
    }
};

async function createActivity({ name, description }) {
    // return the new activity:
    try {
        const { rows: [ activity ] } = await client.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description]);

        return activity;
    } catch(error) {
        throw error;
    }
};

async function updateActivity({ id, name, description}) {
    // don't try to update the id
    // do update the name and description
    const setString = Object.keys(name, description).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [ activity ] } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
        `, Object.values(name, description));

    // return the updated activity:
        return activity;
    }   catch (error) {
        throw error;
    }
};