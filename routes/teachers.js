const express = require('express');
const router = express.Router();
const Teacher = require('../models/teachers');
const Course = require('../models/course');
const Instrument = require('../models/instrument');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressErrors');
const { teacherSchema } = require('../schemas.js');

// VALIDATION MIDDLEWARE + JOI

const validateTeacher = (req,res, next) => {
  const { error } = teacherSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg, 400)
  } else {
    next();
  }
}

// TEACHERS ROUTE HANDLERS

router.get('/', async(req, res) => {
  const teachers = await Teacher.find({}).populate('instrument').populate('course');
  res.render('teachers/index', { teachers });
})

router.get('/new', async(req, res) => {
  const courses = await Course.find({});
  const instruments = await Instrument.find({});
  res.render('teachers/new', { courses, instruments });
})

router.post('/', validateTeacher, catchAsync(async(req, res) => {
  const teacher = new Teacher(req.body.teacher);
  await Course.updateMany({'_id' : teacher.course}, { $push: {teacher : teacher._id}})
  await teacher.save();
  req.flash('success', `${teacher.name} was successfully added`);
  res.redirect(`/teachers/${teacher._id}`);
}))

router.get('/:id', catchAsync(async(req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('instrument').populate('course');
  if (!teacher) {
    req.flash('error', 'Cannot find that teacher!');
    return res.redirect('/teachers');
  }
  res.render('teachers/show', { teacher });
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    req.flash('error', 'Cannot find that teacher!');
    return res.redirect('/teachers');
  }
  res.render('teachers/edit', { teacher });
}));


// UPDATE HANDLER

router.put('/:id', validateTeacher, catchAsync(async(req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, { ...req.body.teacher });
  req.flash('success', `${teacher.name} was successfully updated!`);
  res.redirect(`/teachers/${teacher._id}`);
}))

router.delete('/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  await Course.findByIdAndUpdate(teacher.course, { $pull: { teacher: id }});
  await Teacher.findByIdAndDelete(id);
  req.flash('success', `${teacher.name} was successfully deleted!`);
  res.redirect('/teachers');
}));

module.exports = router;