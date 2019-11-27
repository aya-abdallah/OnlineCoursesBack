const express = require("express");
const CourseRouter = express.Router();
const Course = require("../../models/courses");
const Category = require("../../models/category");
const CourseCategory = require("../../models/courseCategory");
const RegisteredCourse = require("../../models/registeredCourse");
const CompletedCourse = require("../../models/completedCourse");
const multer = require('multer');
const auth = require("../auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


CourseRouter.get("/", (req, res) => {
  Course.find().then(courses =>
    res.json(courses)
  );
});

CourseRouter.post("/", auth.required, upload.single('photo'), (req, res) => {

  let photo = 'uploads/book1.jpg'
  if (req.file) {
    photo = req.file.path;
  }

  const newCourse = new Course({
    photo: photo,
    name: req.body.name,
    points: req.body.points,
    description: req.body.description
  });
  console.log("cats=", req.body);
  newCourse
    .save()
    .then(course => {
      const newCourseCategory = new CourseCategory({
        courseId: course._id,
        categoryId: req.body.category
      });
      newCourseCategory.save().then(data => res.json(data)).catch(err => res.json(err));
    }).catch(err => res.json(err));
});

//edit course
CourseRouter.put("/:id", auth.required, upload.single('photo'), (req, res) => {
  Course.findOne({ _id: req.params.id }).then(course => {
    let photo = course.photo
    if (req.file) {
      photo = req.file.path;
    }
    course.photo = photo;
    course.name = req.body.name;
    course.points = req.body.points
    course.description = req.body.description;
    course.save().then(course => res.json(course)).catch(err => res.json(err))

    CourseCategory.findOne({ courseId: course._id }).then(courseCategory => {
      courseCategory.categoryId = req.body.category;
      courseCategory.save().then(courseCategory => res.json(courseCategory)).catch(err => res.json(err))
    })

  })

})

CourseRouter.delete("/:id", auth.required, (req, res) => {
  console.log("params = ", req.params.id);
  CourseCategory.findOneAndDelete({ courseId: req.params.id }).then(() => {
    Course.findOneAndDelete({ _id: req.params.id }).then(course => {
      res.json(course);
    });
    CompletedCourse.deleteMany({ courseId: req.params.id });
    RegisteredCourse.deleteMany({ courseId: req.params.id });
  }).catch(err => res.send(err));

});

module.exports = CourseRouter;
