const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Instrument = require('../models/instrument');
const { instrumentSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressErrors');
const {isLoggedIn} = require('../middleware');

const validateInstrument = (req, res, next) => {
  const { error } = instrumentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg, 400)
  } else {
    next();
  }
}

router.get('/', catchAsync(async(req, res) => {
  const instruments = await Instrument.find({});
  res.render('instruments/index', { instruments });
}));

router.get('/new',isLoggedIn, catchAsync(async(req, res) => {
  const courses = await Course.find({})
  res.render('instruments/new', { courses });
}));

router.post('/',isLoggedIn, validateInstrument , catchAsync(async(req, res) => {
  const newInstrument = new Instrument(req.body.instrument);
  await Course.updateMany({'_id' : newInstrument.course}, { $push: {instrument: newInstrument._id}})
  await newInstrument.save();
  req.flash('success', `${newInstrument.name} was successfully Added!`);
  res.redirect('/instruments');
}));

router.get('/:id', catchAsync(async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  if (!instrument) {
    req.flash('error', 'Cannot find that instrument!');
    return res.redirect('/instruments');
  }
  res.render('instruments/show', { instrument });
}));

router.get('/:id/edit',isLoggedIn, catchAsync(async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  const courses = await Course.find({});
  req.flash('success', `${instrument.name} was successfully Updated!`);
  res.render('instruments/edit', { instrument, courses });
}));

// UPDATE HANDLERS

router.put('/:id',isLoggedIn, validateInstrument, catchAsync(async(req, res) => {
  const instrument = await Instrument.findByIdAndUpdate(req.params.id, { ...req.body.instrument });
  if (!instrument) {
    req.flash('error', 'Cannot find that instrument!');
    return res.redirect('/instruments');
  }
  res.redirect(`/instruments/${instrument._id}`);
}));

router.delete('/:id',isLoggedIn, async(req, res) => {
  const { id } = req.params;
  const instrument = await Instrument.findById(id);
  await Course.findByIdAndUpdate(instrument.course, { $pull: { instrument : id }});
  await Instrument.findByIdAndDelete(id);
  req.flash('success', `${newInstrument.name} was successfully Deleted!`);
  res.redirect('/instruments');
});

module.exports = router;