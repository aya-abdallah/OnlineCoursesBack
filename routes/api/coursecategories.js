const express = require("express");
const courseCategoryRouter = express.Router();
const CourseCategory = require("../../models/courseCategory");
const { ObjectId } = require('mongodb');
const auth = require("../auth");

courseCategoryRouter.get("/:categoryId", (req, res) => {
  console.log("c id = ", req.params.categoryId);
  CourseCategory.find({ categoryId: req.params.categoryId }).populate("courseId").populate("categoryId").then(courseCategory => {
    res.json(courseCategory);
    console.log(courseCategory);
    // courseCategory.populate("courseId").then(c => res.send(c));
  })
})
courseCategoryRouter.get("/", (req, res) => {
  CourseCategory.find().populate('courseId').populate('categoryId').then(courseCategory => {
    res.json(courseCategory);
  });
})

courseCategoryRouter.post("/", auth.required, (req, res) => {

  const newCourseCategory = new CourseCategory({
    courseId: req.body.courseId,
    categoryId: req.body.categoryId
  });
  newCourseCategory
    .save()
    .then(data => {
      console.log("data saved ", data);
      res.json(data);
    })
    .catch(err => res.status(400).send("unable to save to database"));
});

courseCategoryRouter.delete("/:courseId/:categoryId", auth.required, (req, res) => {
  var c = ObjectId(req.params.categoryId);
  CourseCategory.findOne({ courseId: req.params.courseId }).then(courseCategory => {
    console.log(courseCategory)
    CourseCategory.updateOne({ courseId: req.params.courseId },
      { $pull: { 'categoryId': c } }, { safe: true, upsert: true },
      function (err, data) {
        if (err) { return res.json(err) }
      })
      .then(data => res.json(data)).catch(err => res.json(err))
  });

})

module.exports = courseCategoryRouter;
