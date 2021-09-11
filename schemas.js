const Joi = require('joi');

module.exports.teacherSchema = Joi.object({
  teacher: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required().min(15),
    image: Joi.string().required(),
    description: Joi.string().required(),
    course: Joi.string(),
    instrument: Joi.string(),
  }).required()
});

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    instrument: Joi.string(),
    teacher: Joi.string(),
  }).required()
});

module.exports.instrumentSchema = Joi.object({
  instrument: Joi.object({
    name: Joi.string().required(),
    icon: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number(),
    course: Joi.string()
  }).required()
});