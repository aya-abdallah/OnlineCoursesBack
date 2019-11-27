const mongoose = require("mongoose");
const courseCategorySchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
});
const CourseCategory = mongoose.model("CourseCategory", courseCategorySchema);
module.exports = CourseCategory;
