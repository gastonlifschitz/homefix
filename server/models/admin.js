const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
  email: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    trim: true,
    unique: true
  },
  name: { type: String, minLength: 3, required: true, trim: true },
  lastName: { type: String, minLength: 3, required: true, trim: true },
  cellphone: {
    type: String,
    minLength: 3,
    required: true,
    trim: true,
    maxLength: 15
  },
  neighborhoods: [{ type: ObjectId, ref: 'Neighborhood' }],
  timestamp: { type: Date, default: Date.now }
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: config.get('roles').ADMIN
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const Admin = mongoose.model('Admin', adminSchema);

function validateAdminSchema(admin) {
  const schema = Joi.object({
    email: Joi.string(),
    name: Joi.string(),
    lastName: Joi.string(),
    cellphone: Joi.string()
  });

  return schema.validate(admin);
}

function validateEditAdminSchema(admin) {
  const schema = Joi.object({
    name: Joi.string(),
    lastName: Joi.string(),
    cellphone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9-]+$/)
      .required()
  });

  return schema.validate(admin);
}

module.exports.Admin = Admin;
module.exports.validate = validateAdminSchema;
module.exports.validateEdit = validateEditAdminSchema;
