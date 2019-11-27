const mongoose = require("mongoose");
const coursesSchema = new mongoose.Schema({
  photo:String,
  name: String,
  description:String,
  image:String,
  points:Number
});
const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
