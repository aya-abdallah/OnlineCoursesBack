const mongoose = require("mongoose");
const registedCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
const RegistedCourse = mongoose.model("RegistedCourse", registedCourseSchema);
module.exports = RegistedCourse;
