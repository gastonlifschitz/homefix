const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const messageSchema = new Schema({
  message: {
    type: String,
    minlength: 3,
    required: true,
    trim: true
  },
  title: {
    type: String,
    minlength: 3,
    required: true,
    trim: true
  },
  date: { type: Date, default: Date.now },
  _neighborhood: { type: ObjectId, ref: 'Neighborhood' }
});

const Message = mongoose.model('Message', messageSchema);

function validateMessageSchema(message) {
  const schema = Joi.object({
    message: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    date: Joi.date().timestamp()
  });

  return schema.validate(message);
}

module.exports.Message = Message;
module.exports.validate = validateMessageSchema;
