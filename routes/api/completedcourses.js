const express = require("express");
const competeCoursesRouter = express.Router();
const CompeleteCourse = require("../../models/completedCourse");
const auth = require("../auth");

competeCoursesRouter.get("/:userId",auth.required, (req, res) => {
    CompeleteCourse.find({ userId: req.params.userId }, { courseId: true, _id: false }).then(courses => {
        res.json(courses);
    })
})

competeCoursesRouter.get("/points/:userId",auth.required, (req, res) => {
    CompeleteCourse.find({ userId: req.params.userId }, { points: true, _id: false }).then(points => {
        let sum = points.reduce((total, point) =>{ return total + parseInt(point.points)},0)
        res.json(sum);
    })
})

competeCoursesRouter.post("/",auth.required, (req, res) => {

    //   if (req.cookies === undefined || req.cookies.userId === undefined) {
    //     res.status(400).send("you must login with email and password");
    //   } else {
    const completedCourse = new CompeleteCourse({
        courseId: req.body.courseId,
        userId: req.body.userId,
        points: req.body.points

    });
    completedCourse
        .save()
        .then(data => {
            console.log("data saved ", data);
            res.json(data);
        })
        .catch(err => res.status(400).send("unable to save to database"));
    //   }
});

module.exports = competeCoursesRouter;