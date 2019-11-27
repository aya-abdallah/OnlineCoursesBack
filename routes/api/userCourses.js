const express = require("express");
const userCoursesRouter = express.Router();
const UserCourse= require("../../models/courseCategory");
const auth = require("../auth");

userCoursesRouter.get("/",(req,res)=>{
    UserCourse.find().then(userCourses =>{
        res.json(userCourses);
    })
})

userCoursesRouter.post("/", auth.required, (req, res) => {
  if (req.cookies === undefined || req.cookies.userId === undefined) {
    res.status(400).send("you must login with email and password");
  } else {
    const newUserCourse= new UserCourse({
      courseId: req.body.courseId,
      userId: req.body.userId,
      point: 100,
    });
    newUserCourse
      .save()
      .then(data => {
        console.log("data saved ", data);
        res.json(data);
      })
      .catch(err => res.status(400).send("unable to save to database"));
  }
});


module.exports = userCoursesRouter;