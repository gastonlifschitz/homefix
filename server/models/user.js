const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
// const config = require('config')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  email: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    trim: true
  },
  neighbour: { ref: 'Neighbour', type: Schema.Types.ObjectId },
  admin: { ref: 'Admin', type: Schema.Types.ObjectId },
  employee: { ref: 'Employee', type: Schema.Types.ObjectId },
  resetLink: { type: String, default: '' },
  password: {
    type: String,
    minlength: 3,
    maxlenght: 16,
    required: true,
    trim: true
  },
  timestamp: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      neighbour: this.neighbour,
      admin: this.admin,
      employee: this.employee
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUserSchema(user) {
  const schema = {
    email: Joi.string(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUserSchema;
