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

// courseSchema.post('findOneAndDelete', async function (doc) {
//   if (doc) {
//     await Instrument.deleteMany({
//       _id: {
//         $in: doc.instrument
//       }
//     })
//   }
// })

module.exports = mongoose.model("Course", courseSchema)