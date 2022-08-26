const mongoose = require('mongoose');
const { Schema } = mongoose;
// const jwt = require("jsonwebtoken");
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

var imageSchema = new Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
