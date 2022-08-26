const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const rubroSchema = new Schema({
  rubroType: {
    type: String,
    enum: config.get('areaTypes'),
    required: true,
    upperCase: true,
    trim: true
  },
  issuer: { type: ObjectId, ref: 'Employee', required: true },
  services: [{ type: String, trim: true }],
  //Ver de agregar lista de precios
  blackList: { type: Boolean, default: false, required: true },

  timestamp: { type: Date, default: Date.now }
});

const Rubro = mongoose.model('Rubro', rubroSchema);

function validateRubroSchema(Rubro) {
  const schema = Joi.object({
    services: Joi.array(),
    issuer: Joi.objectId().required(),
    blackList: Joi.boolean().required(),
    rubroType: Joi.any().valid(...config.get('areaTypes'))
  });

  return schema.validate(Rubro);
}

module.exports.Rubro = Rubro;
module.exports.validate = validateRubroSchema;
