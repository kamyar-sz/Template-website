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

// instrumentSchema.post('findOneAndDelete', async function (doc) {
//   if (doc) {
//     await Course.deleteMany({
//       _id: {
//         $in: doc.course
//       }
//     })
//   }
// })

module.exports = mongoose.model("Instrument", instrumentSchema)