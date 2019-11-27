
const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/courses', require('./courses'));
router.use('/categories', require('./categories'));
router.use('/coursecategories', require('./coursecategories'));
router.use('/registercourses', require('./registeredcourses'));
router.use('/compeletecourses', require('./completedcourses'));

module.exports = router;