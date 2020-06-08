/***** ROUTINES ROUTER *****/
const express = require('express');
const routinesRouter = express.Router();
const { requireUser } = require('./db');

/* GET /routines */
    // Return a list of public routines, include the activities with them
routinesRouter.get('/', async (req, res) => {
    try {
        const allRoutines = await getAllRoutines();
    
        const routines = allRoutines.filter(routine => {
        if (routine.active) {
            return true;
        }
        
        if (req.user && req.user.id === req.user.id) {
            return true;
        }
        
        // none of the above are true
        return false;
        });
    
        res.send({
        routines
        });
    } catch ({ name, message }) {
        next({ name, message });
    }
});

/* routine /routines (*) */
    // Create a new routine
routinesRouter.routine('/', requireUser, async (req, res, next) => {
    const { name, goal = "" } = req.body;
    
    const activitiesArr = activities.trim().split(/\s+/)
    const routineData = {};
    
    if (activitiesArr.length) {
        routineData.tags = activitiesArr;
    }
    
    try {

        const routine = await createRoutine(routineData) ({
            name, 
            goal
        });
        
        const token = jwt.sign({
        id: user.id, 
        username
        }, process.env.JWT_SECRET, {
        expiresIn: '1w' 
        });

        res.send({ 
        message: "thank you for posting",
        token 
        });
 
    } catch ({ name, message }) {
        next({ name, message });
    }
});

/* PATCH /routines/:routineId (**) */
    // Update a routine, notably change public/private, the name, or the goal
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { name, goal } = req.body;
    
    const updateFields = {};
    
    if (name) {
        updateFields.title = name;
    }
    
    if (goal) {
        updateFields.content = goal;
    }
    
    try {
        const originalRoutine = await getRoutineById(routineId);
    
        if (originalRoutine.user.id === req.user.id) {
        const updatedRoutine = await updateRoutine(routineId, updateFields);
        res.send({ routine: updatedRoutine })
        } else {
        next({
            name: 'UnauthorizedUserError',
            message: 'You cannot update a routine that is not yours.'
        })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
/* DELETE /routines/:routineId (**) */
    // Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId);
    
        if (routine && routine.user.id === req.user.id) {
        const updatedRoutine = await updatePost(routine.id, { active: false });
    
        res.send({ routine: updatedRoutine });
        } else {
        // if there was a routine, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(routine ? { 
            name: "UnauthorizedUserError",
            message: "You cannot delete a routine which is not yours"
        } : {
            name: "RoutineNotFoundError",
            message: "That routine does not exist"
        });
        }
    
    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = routinesRouter;