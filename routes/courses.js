const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Instrument = require('../models/instrument');
const { courseSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressErrors');

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg, 400)
  } else {
    next();
  }
}

router.get('/', catchAsync(async(req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
}));

router.get('/new', (req, res) => {
  res.render('courses/new');
});

router.post('/', validateCourse, catchAsync(async(req, res) => {
  const course = new Course(req.body.course);
  await course.save();
  req.flash('success', `${course.name} was successfully Added!`);
  res.redirect('/courses');
}))

router.get('/:id', catchAsync(async(req, res) => {
  const course = await Course.findById(req.params.id).populate('instrument').populate('teacher');
  if (!course) {
    req.flash('error', 'Cannot find that course!');
    return res.redirect('/courses');
  }
  res.render('courses/show', { course })
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash('error', 'Cannot find that course!');
    return res.redirect('/courses');
  }
  res.render('courses/edit', { course });
}));

// UPDATE HANDLER

router.put('/:id', validateCourse, catchAsync(async(req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { ...req.body.course });
  req.flash('success', `${course.name} was successfully Updated!`);
  res.redirect(`/courses/${course._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  await Instrument.findByIdAndUpdate(course.instrument, { $pull: { course : id}});
  await Course.findByIdAndDelete(id);
  req.flash('success', `${course.name} was successfully Deleted!`);
  res.redirect('/courses');
}));

module.exports = router;