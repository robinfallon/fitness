/********** USERS ROUTER *********/
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

const express = require('express');
const usersRouter = express.Router();
const { getAllUsers } = require('../db');
//-------------------------------------------------------

/* POST /users/register */
    // Create a new user. 
    // Require username and password, and hash password before saving user to DB. 
    // Require all passwords to be at least 8 characters long.
    // Throw errors for duplicate username, or password-too-short.

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists.'
            });
        }

        const user = await createUser({
            username, 
            password
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "Thank you for signing up!",
            token
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
})
//-------------------------------------------------------

/* POST /users/login */
    // Log in the user. 
    // Require username and password, and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token.
    // Keep the id and username in the token.
usersRouter.post('/register', async (req, res, next) => {
    if (!req.user) {
        next({
          name: "MissingUserError",
          message: "You must be logged in to perform this action"
        });
      }
    
      next();
});


//-------------------------------------------------------

/* GET /users/:username/routines */
    // Get a list of public routines for a particular user. 

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
    
    res.send({
        users
    });
});


module.exports = usersRouter;