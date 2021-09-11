const mongoose = require('mongoose');
const Instrument = require('./instrument')
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  instrument: [{
    type: Schema.Types.ObjectId,
    ref: 'Instrument'
  }],
  image: String,
  description: String,
  teacher: [{
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
})

module.exports = mongoose.model("Course", courseSchema)