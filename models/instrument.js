const mongoose = require('mongoose');
const Course = require('./course');
const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
  name: String,
  icon: String,
  image: String,
  description: String,
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  price: Number
});

module.exports = mongoose.model("Instrument", instrumentSchema)