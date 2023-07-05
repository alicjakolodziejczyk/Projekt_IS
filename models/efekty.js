const mongoose = require('mongoose');
const Joi = require('joi');


const efektSchema = new mongoose.Schema({
  kod: {
    type: String,
  },
  nazwa: {
    type: String,
  },
  kategoria: {
    type: String,
  }

});


const validate = (Efekt) => {
  const schema = Joi.object({
    kod: Joi.string(),
    nazwa: Joi.string(),
    kategoria: Joi.string(),
  });
  return schema.validate(Efekt);
};

const Efekt = mongoose.model('efekt', efektSchema);

module.exports = { Efekt, validate };
