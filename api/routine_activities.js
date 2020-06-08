/***** ROUTINE_ACTIVITIES ROUTER *****/

const express = require('express');
const routineActivitiesRouter = express.Router();
const { requireUser} = require("../db");

//-------------------------------------------------------------
/* PATCH */
// Update the count or duration on the routine activity:
routineActivitiesRouter.patch("/:routineActivityId",
    requireUser,
    async (req, res, next) => {
        const { routineActivityId } = req.params;
        const { duration, count } = req.body;

        try {
            const routines = await getRoutinesByActivity(routineId)
            console.log("something else", routines);
            routines.filter((r) => r.creatorId === req.user.id);
            if (routines.length) {
                const updatedRoutine = await updateRoutine(
                    routines.map((r) => r.id),
                    count,
                    duration
                );
                res.send({ updatedRoutine });
            } else {
                next({
                    name: 'UnauthorizedUserError',
                    message: 'You cannot update an activity that you did not create.'
                })
            }
        } catch ({ name, message }) {
            next ({ name, message });
        }
    }
);


//-------------------------------------------------------------
/* DELETE */
// Remove an activity from a routine, use hard delete:
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const post = await getAllRoutinesByUser(req.params.routineId);

        if (routine && routine.user.id === req.user.id) {
            const updatedRoutine = await updateRoutine(routine.id, { active: false});

            res.send({ routine: updatedRoutine });
        } else {
        // if there was a routine, throw UnauthorizedUserError...
            next(routine ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a routine which is not yours."
            } : {
        // otherwise throw RoutineNotFoundError...
                name: "RoutineNotFoundError",
                message: "That routine does not exist"
            });
        }
    } catch ({ name, message }) {
      next({ name, message })
    }
});

module.exports = routineActivitiesRouter;