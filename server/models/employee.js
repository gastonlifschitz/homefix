const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');

const employeeSchema = new Schema(
  {
    name: { type: String, minlength: 3, required: true, trim: true },
    lastName: { type: String, minlength: 3, required: true, trim: true },
    description: {
      type: String,
      minLength: 0,
      maxLength: 300,
      trim: true,
      default: ''
    },
    cellPhone: {
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
    rubros: [{ type: ObjectId, ref: 'Rubro', required: true }],
    paymentMethods: [String],
    availableDates: [Boolean],
    availableHours: [Object],
    workedFor: [{ type: ObjectId, ref: 'Neighbour' }],

    timestamp: { type: Date, default: Date.now },
    blackList: { type: Boolean, default: false },
    selectedDistricts: [Object]
  },
  { timestamps: true }
);

employeeSchema.statics.toGetApiEmployeeSchema = function (employee, req) {
  return {
    ...employee,
    profilePic:
      req.protocol +
      '://' +
      req.get('host') +
      '/api/employees/profilePic/' +
      employee._id
  };
};

employeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      role: config.get('roles').EMPLOYEE
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const Employee = mongoose.model('Employee', employeeSchema);

function validateEmployeeSchema(employee) {
  const schema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    description: Joi.string().max(300).min(0),
    email: Joi.string(),
    rubros: Joi.array(),
    cellPhone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9-]+$/)
      .required(),
    paymentMethods: Joi.array(),
    availableDates: Joi.array(),
    availableHours: Joi.array(),
    blackList: Joi.boolean().required(),
    selectedDistricts: Joi.array(),
    workedFor: Joi.array()
  });

  return schema.validate(employee);
}

function validateEmployeeEditSchema(employee) {
  const schema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    description: Joi.string().max(300).min(0),
    email: Joi.string(),
    rubros: Joi.array(),
    cellPhone: Joi.string()
      .min(10)
      .max(15)
      .pattern(/^[0-9-]+$/)
      .required(),
    paymentMethods: Joi.array(),
    availableDates: Joi.array(),
    availableHours: Joi.array(),
    blackList: Joi.boolean(),
    selectedDistricts: Joi.array(),
    workedFor: Joi.array()
  });

  return schema.validate(employee);
}

module.exports.Employee = Employee;
module.exports.validate = validateEmployeeSchema;
module.exports.validateEdit = validateEmployeeEditSchema;
