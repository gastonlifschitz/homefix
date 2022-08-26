const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const neighborhoodSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: { type: Object, required: true, unique: true },
  admins: [{ type: ObjectId, ref: 'Admin' }],
  neighbours: [{ type: ObjectId, ref: 'Neighbour' }],
  messages: [{ type: Object, ref: 'Message' }],
  workers: [{ type: ObjectId, ref: 'Employee' }],
  blackList: [{ type: ObjectId, ref: 'User' }],
  timestamp: { type: Date, default: Date.now }
});

const Neighborhood = mongoose.model('Neighbourhood', neighborhoodSchema);

function validateNeighborhoodSchema(neighbourhood) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
      lat: Joi.any(),
      lng: Joi.any(),
      address: Joi.string().required(),
      administrative_area_level_2: Joi.string().required()
    }).required(),
    admins: Joi.array(),
    neighbours: Joi.array(),
    messages: Joi.array(),
    workers: Joi.array(),
    blackList: Joi.array()
  });

  return schema.validate(neighbourhood);
}

module.exports.Neighborhood = Neighborhood;
module.exports.validate = validateNeighborhoodSchema;
