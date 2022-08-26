const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const userGallerySchema = new Schema({
  email: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    trim: true,
    unique: true
  },
  imgCollection: {
    type: Array
  },
  profilePic: { type: String },

  timestamp: { type: Date, default: Date.now }
});

const UserGallery = mongoose.model('UserGallery', userGallerySchema);

module.exports.UserGallery = UserGallery;
