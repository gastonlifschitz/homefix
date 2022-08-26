const config = require('config');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');

const superAdminSchema = new Schema({
  email: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 3,
    maxlenght: 16,
    required: true,
    trim: true
  },
  timestamp: { type: Date, default: Date.now }
});

superAdminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      superAdmin: true,
      role: config.get('roles').SUPER_ADMIN
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const SuperAdmin = mongoose.model('superAdmin', superAdminSchema);

module.exports.SuperAdmin = SuperAdmin;
