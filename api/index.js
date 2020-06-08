/***** APIROUTER *****/
// JWT middleware:
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  // The Authorization header wasn't set:
  if (!auth) { // nothing to see here
    next();
    // It was set, and begins with Bearer followed by a space:
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
    // A user set the header, but it wasn't formed correctly:
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
});

// Attach routers below here:

const express = require('express');
const apiRouter = express.Router();

//usersRouter
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

//activitiesRouter
const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

//routinesRouter
const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

//routineActivitiesRouter
const routineActivitiesRouter = require('./routine_activities');
apiRouter.use('/routine_activities', routineActivitiesRouter);

// all routers attached ABOVE here
// error handler:
apiRouter.use((error, req, res, next) => {
    res.send(error);
});

module.exports = apiRouter;
