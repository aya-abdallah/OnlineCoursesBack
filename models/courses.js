const mongoose = require("mongoose");
const coursesSchema = new mongoose.Schema({
  photo: String,
  name: String,
  description: String,
  image: String,
  points: { type: String, default: 0 }
});
const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
