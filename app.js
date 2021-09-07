const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressErrors');
const { teacherSchema } = require('./schemas.js');
const methodOverride = require('method-override');
const Teacher = require('./models/teachers');
const Course = require('./models/course');
const Instrument = require('./models/instrument');


mongoose.connect('mongodb://localhost:27017/Music-site', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateTeacher = (req,res, next) => {
  const { error } = teacherSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg, 400)
  } else {
    next();
  }
}


// HOMEPAGE ROUTE HANDLERS

app.get('/', (req, res) => {
  res.render('home');
});


// TEACHERS ROUTE HANDLERS

app.get('/teachers', async(req, res) => {
  const teachers = await Teacher.find({}).populate('instrument').populate('course');
  res.render('teachers/index', { teachers });
})

app.get('/teachers/new', async(req, res) => {
  const courses = await Course.find({});
  const instruments = await Instrument.find({});
  res.render('teachers/new', { courses, instruments });
})

app.post('/teachers', validateTeacher, catchAsync(async(req, res) => {
  const teacher = new Teacher(req.body.teacher);
  await Course.updateMany({'_id' : teacher.course}, { $push: {teacher : teacher._id}})
  await teacher.save();
  res.redirect('/teachers');
}))

app.get('/teachers/:id', catchAsync(async(req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('instrument').populate('course');
  res.render('teachers/show', { teacher });
}))

app.get('/teachers/:id/edit', catchAsync(async(req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  res.render('teachers/edit', { teacher });
}));


// UPDATE HANDLER

app.put('/teachers/:id', validateTeacher, catchAsync(async(req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, { ...req.body.teacher });
  res.redirect(`/teachers/${teacher._id}`);
}))

app.delete('/teachers/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  await Course.findByIdAndUpdate(teacher.course, { $pull: { teacher: id }});
  await Teacher.findByIdAndDelete(id);
  res.redirect('/teachers');
}));

// COURSES ROUT HANDLERS

app.get('/courses', async(req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
});

app.get('/courses/new', (req, res) => {
  res.render('courses/new');
});

app.post('/courses', async(req, res) => {
  const course = new Course(req.body.course);
  await course.save();
  res.redirect('/courses');
})

app.get('/courses/:id', async(req, res) => {
  const course = await Course.findById(req.params.id).populate('instrument').populate('teacher');
  res.render('courses/show', { course })
});

app.get('/courses/:id/edit', async(req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('courses/edit', { course });
})

// UPDATE HANDLER

app.put('/courses/:id', async(req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { ...req.body.course });
  res.redirect(`/courses/${course._id}`);
});

app.delete('/courses/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  await Instrument.findByIdAndUpdate(course.instrument, { $pull: { course : id}});
  await Course.findByIdAndDelete(id);
  res.redirect('/courses');
}));

// INSTRUMENTS ROUT HANDLERS

app.get('/instruments', async(req, res) => {
  const instruments = await Instrument.find({});
  res.render('instruments/index', { instruments });
});

app.get('/instruments/new', async(req, res) => {
  const courses = await Course.find({})
  res.render('instruments/new', { courses });
});

app.post('/instruments', async(req, res) => {
  const newInstrument = new Instrument(req.body.instrument);
  await Course.updateMany({'_id' : newInstrument.course}, { $push: {instrument: newInstrument._id}})
  await newInstrument.save();
  res.redirect('/instruments');
});

app.get('/instruments/:id', async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  res.render('instruments/show', { instrument });
});

app.get('/instruments/:id/edit', async(req, res) => {
  const instrument = await Instrument.findById(req.params.id).populate('course');
  const courses = await Course.find({});
  res.render('instruments/edit', { instrument, courses });
})

// UPDATE HANDLERS

app.put('/instruments/:id', async(req, res) => {
  const instrument = await Instrument.findByIdAndUpdate(req.params.id, { ...req.body.instrument });
  res.redirect(`/instruments/${instrument._id}`);
});

app.delete('/instruments/:id', async(req, res) => {
  const { id } = req.params;
  const instrument = await Instrument.findById(id);
  await Course.findByIdAndUpdate(instrument.course, { $pull: { instrument : id }});
  await Instrument.findByIdAndDelete(id);
  res.redirect('/instruments');
});

// ERROR ROUTE HANDLERS

app.all('*', (req, res, next) => {
  next(new expressError('صفحه مورد نظر پیدا نشد !', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'خطایی رخ داده است !'
  res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
  console.log('Port 3000 Ready to serve');
});

