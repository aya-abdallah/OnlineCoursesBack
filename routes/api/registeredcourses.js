const express = require("express");
const registerCoursesRouter = express.Router();
const RegisterCourse = require("../../models/registeredCourse");
const auth = require("../auth");

registerCoursesRouter.get("/:userId",auth.required, (req, res) => {
    let register = {};
    RegisterCourse.find({ userId: req.params.userId }, { _id: false, courseId: true }).then(coursesId => {
        register.coursesId = coursesId
        RegisterCourse.find({ userId: req.params.userId }).populate("courseId").then(allRegister => {
            register.allRegister = allRegister;
            res.send(register);
        })

    })
})

registerCoursesRouter.post("/",auth.required, (req, res) => {

    //   if (req.cookies === undefined || req.cookies.userId === undefined) {
    //     res.status(400).send("you must login with email and password");
    //   } else {
    RegisterCourse.findOne({ courseId: req.body.courseId, userId: req.body.userId })
        .then(course => {
            if (course) {
                RegisterCourse.findOneAndDelete({ courseId: req.body.courseId, userId: req.body.userId })
                    .then(res => res.json(res));
            } else {
                const newRegister = new RegisterCourse({
                    courseId: req.body.courseId,
                    userId: req.body.userId,
                });
                newRegister
                    .save()
                    .then(data => {
                        console.log("data saved ", data);
                        res.json(data);
                    })
                    .catch(err => res.json(err));
            }
        }).catch(err => res.json(err))

    //   }
});

module.exports = registerCoursesRouter;