/***** ACTIVITIES ROUTER *****/
const express = require('express');
const activitiesRouter = express.Router();
const { requireUser } = require("../db");

/* GET /activities */
    // Just return a list of all activities in the database
activitiesRouter.get('/:activityName/routines', async (req, res, next) => {
    
    try {
        const activities = await getAllActivities();
 
        console.log("A request is being made to /activities");
    } catch ({ name, message }) {
        res.send({ message: 'Here are the activities!'});
    }
});

/* POST /activities (*) */
    // Create a new activity
activitiesRouter.post('/:activities', requireUser, async (req, res, next) => {
    const { name, description = "" } = req.body;

    const activitiesArr = activities.trim().split(/\s+/)
    const routineData = {};

    if (activitiesArr.length) {
        routineData = activitiesArr;
    }

    try {
        const post = await createPost(postData) ({
           name,
           description
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "Thank you for creating a new activity!",
            token
        });
    } catch ({ name, message }) {
        next({ name, message });
    }
});

/* PATCH /activities/:activityId (*) */
    // Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
activitiesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { name, description } = req.body;
    
    const updateFields = {};
    
    if (activities && activities.length > 0) {
        updateFields.activities = activities.trim().split(/\s+/);
    }
    
    if (name) {
        updateFields.name = name;
    }
    
    if (description) {
        updateFields.description = description;
    }
    
    try {
        const originalRoutine = await getRoutineById(routineId);
    
        if (originalRoutine.user.id === req.user.id) {
        const updatedRoutine = await updateRoutine(routineId, updateFields);
        res.send({ routine: updatedRoutine })
        } else {
        next({
            name: 'UnauthorizedUserError',
            message: 'You cannot update an activity that is not yours'
        })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

/* GET /activities/:activityId/routines */
    // Get a list of all public routines which feature that activity
activitiesRouter.get('/activityId/routines', async (req, res) => {
    try {
        const allActivities = await getAllActivities();

        const activities = allActivities.filter(activity => {
            if (activity.public) {
                return true;
            }
            return false;
        });
        res.send({
            activities
        });
    } catch ({ name, messgae }) {
        next({ name, message });
    }
});

module.exports = activitiesRouter;