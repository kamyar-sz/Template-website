const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Teacher = require('./models/teachers');


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

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/teachers', async(req, res) => {
  const teachers = await Teacher.find({});
  res.render('teachers/index', { teachers });
})

app.get('/teachers/new', (req, res) => {
  res.render('teachers/new');
})

app.post('/teachers', async(req, res) => {
  const teacher = new Teacher(req.body.teacher);
  await teacher.save();
  res.redirect('/teachers');
})

app.get('/teachers/:id', async(req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  res.render('teachers/show', { teacher });
})

app.get('/teachers/:id/edit', async(req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  res.render('teachers/edit', { teacher });
})

app.put('/teachers/:id', async(req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, { ...req.body.teacher });
  res.redirect(`/teachers/${teacher._id}`);
})

app.delete('/teachers/:id', async(req, res) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  res.redirect('/teachers');
})

app.listen(3000, () => {
  console.log('Port 3000 Ready to serve');
});

