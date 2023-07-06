const mongoose = require('mongoose');
const Joi = require('joi');


const przedmiotSchema = new mongoose.Schema({
  kod: {
    type: String,
  },
  nazwa: {
    type: String,
  },
  rok: {
    type: Number
  },
  semestr: {
    type: Number
  },
  obieralny: {
    type: Boolean
  },
  specjalizacja: {
    type: String
  },
  efekty: {
    type: Array
  }
});


const validate = (Przedmiot) => {
  const schema = Joi.object({
    kod: Joi.string().required(),
    nazwa: Joi.string().required(),
    rok: Joi.number().integer().min(1).max(4).required(),
    semestr: Joi.number().integer().min(1).max(7).required(),
    obieralny: Joi.Boolean().required(),
    specjalizacja: Joi.String().min(2).max(3),
    efekty: Joi.Array().required()
  });
  return schema.validate(Przedmiot);
};

const Przedmiot = mongoose.model('przedmiot', przedmiotSchema);

module.exports = { Przedmiot, validate };
