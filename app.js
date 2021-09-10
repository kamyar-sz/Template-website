const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Course = require('./models/course');
const Instrument = require('./models/instrument');

const teachers = require('./routes/teachers');
const courses = require('./routes/courses');
const instruments = require('./routes/instruments');


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


// ROUTE HANDLERS

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/teachers', teachers);
app.use('/courses', courses);
app.use('/instruments', instruments);


// ERROR ROUTE HANDLERS

app.all('*', (req, res, next) => {
  next(new expressError('صفحه مورد نظر پیدا نشد !', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'خطایی رخ داده است !'
  res.status(statusCode).render('error', { err });
})


// Connection check

app.listen(3000, () => {
  console.log('Port 3000 Ready to serve');
});

