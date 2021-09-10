const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Instrument = require('../models/instrument');

router.get('/', async(req, res) => {
  const instruments = await Instrument.find({});
  res.render('instruments/index', { instruments });
});

router.get('/new', async(req, res) => {
  const courses = await Course.find({})
  res.render('instruments/new', { courses });
});

router.post('/', async(req, res) => {
  const newInstrument = new Instrument(req.body.instrument);
  await Course.updateMany({'_id' : newInstrument.course}, { $push: {instrument: newInstrument._id}})
  await newInstrument.save();
  res.redirect('/instruments');
});

router.get('/:id', async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  res.render('instruments/show', { instrument });
});

router.get('/:id/edit', async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  const courses = await Course.find({});
  res.render('instruments/edit', { instrument, courses });
})

// UPDATE HANDLERS

router.put('/:id', async(req, res) => {
  const instrument = await Instrument.findByIdAndUpdate(req.params.id, { ...req.body.instrument });
  res.redirect(`/instruments/${instrument._id}`);
});

router.delete('/:id', async(req, res) => {
  const { id } = req.params;
  const instrument = await Instrument.findById(id);
  await Course.findByIdAndUpdate(instrument.course, { $pull: { instrument : id }});
  await Instrument.findByIdAndDelete(id);
  res.redirect('/instruments');
});

module.exports = router;