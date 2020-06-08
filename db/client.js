// This is a place to build and export an unconnected client.

const { Client } = require('pg'); 

// supply the db name and location of the database
// connection line:
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev');

const apiRouter = require('./api');
server.use('/api', apiRouter);

module.exports = {  
    client,
};