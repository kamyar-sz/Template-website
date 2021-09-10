const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Instrument = require('../models/instrument');


router.get('/', async(req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
});

router.get('/new', (req, res) => {
  res.render('courses/new');
});

router.post('/', async(req, res) => {
  const course = new Course(req.body.course);
  await course.save();
  res.redirect('/courses');
})

router.get('/:id', async(req, res) => {
  const course = await Course.findById(req.params.id).populate('instrument').populate('teacher');
  res.render('courses/show', { course })
});

router.get('/:id/edit', async(req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('courses/edit', { course });
})

// UPDATE HANDLER

router.put('/:id', async(req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { ...req.body.course });
  res.redirect(`/courses/${course._id}`);
});

router.delete('/:id', (async(req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  await Instrument.findByIdAndUpdate(course.instrument, { $pull: { course : id}});
  await Course.findByIdAndDelete(id);
  res.redirect('/courses');
}));

module.exports = router;