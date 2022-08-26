const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const neighbourSchema = new Schema(
  {
    name: { type: String, minlength: 3, required: true, trim: true },
    lastName: { type: String, minlength: 3, required: true, trim: true },
    cellphone: {
      type: String,
      minLength: 10,
      maxlenght: 15,
      required: true,
      trim: true
    },
    email: {
      type: String,
      maxlenght: 255,
      lowercase: true,
      trim: true,
      unique: true
    },
    neighborhoods: [{ type: ObjectId, ref: 'Neighborhood' }],
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Neighbour = mongoose.model('Neighbour', neighbourSchema);

function validateNeighbourSchema(neighbour) {
  const schema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string(),
    cellphone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9-]+$/)
      .required(),
    neighborhoods: Joi.array()
  });

  return schema.validate(neighbour);
}

function validateEditNeighbourSchema(neighbour) {
  const schema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    cellphone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9-]+$/)
      .required()
  });

  return schema.validate(neighbour);
}

module.exports.Neighbour = Neighbour;
module.exports.validate = validateNeighbourSchema;
module.exports.validateEdit = validateEditNeighbourSchema;
