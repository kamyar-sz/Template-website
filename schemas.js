const Joi = require('joi');

module.exports.teacherSchema = Joi.object({
  teacher: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required().min(15),
    image: Joi.string().required(),
    description: Joi.string().required(),
    course: Joi.string().required(),
    instrument: Joi.string().required(),
  }).required()
});