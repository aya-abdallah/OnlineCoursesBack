const express = require("express");
const categoryRouter = express.Router();
const Category = require("../../models/category");
const CourseCategory = require("../../models/courseCategory");
const { ObjectId } = require('mongodb');
const passport = require("passport");
const auth = require("../auth");

categoryRouter.get("/", (req, res) => {
  Category.find().then(categories =>
    res.json(categories)
  );
});

categoryRouter.post("/", auth.required, (req, res) => {

  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory
    .save()
    .then(data => {
      console.log("data saved ", data);
      res.json(data);
    })
    .catch(err => res.status(400).send("unable to save to database"));
});

categoryRouter.put("/:id", auth.required, (req, res) => {
  Category.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name } }).then(category => {
    res.json(category);
  }).catch(err => res.json(err));
});

categoryRouter.delete("/:id", auth.required, (req, res) => {
  Category.findOneAndDelete({ _id: req.params.id }).then(category => {
    CourseCategory.updateMany({},
      { $pull: { 'categoryId': ObjectId(req.params.id) } }, { safe: true, upsert: true },
      function (err, data) {
        if (err) { return res.json(err) }
      })
      .then(data => res.json(data)).catch(err => res.json(err))
  });
});

categoryRouter.get("/:id", (req, res) => {
  console.log("id = ", req.params.id);
  CourseCategory.find({ categoryId: req.params.id }).populate('courseId').then((data) => {
    res.json(data);
  }).catch(err => {
    console.log(err);
  });
})

module.exports = categoryRouter;
