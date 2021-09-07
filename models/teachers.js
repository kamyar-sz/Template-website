const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  name: String,
  age: Number,
  description: String,
  image: String,
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  instrument: [{
    type: Schema.Types.ObjectId,
    ref: 'Instrument'
  }],
});

module.exports = mongoose.model('Teacher', TeacherSchema);