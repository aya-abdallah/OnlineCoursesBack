const mongoose = require("mongoose");
const completedCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    points: { type: Number, default:0},
});
const CompletedCourse = mongoose.model("CompletedCourse", completedCourseSchema);
module.exports = CompletedCourse;
