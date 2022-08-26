const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;
const Joi = require('joi');

const chatInfoSchema = new Schema(
  {
    _receiver: { type: ObjectId, required: true, ref: 'Neighbour' },
    _provider: { type: ObjectId, required: true, ref: 'Employee' }
  },
  { timestamps: true }
);

function validatechatInfoSchema(chatInfo) {
  const schema = Joi.object({
    _receiver: Joi.any().required(),
    _provider: Joi.any().required()
  });

  return schema.validate(chatInfo);
}

const ChatInfo = mongoose.model('ChatInfo', chatInfoSchema);

module.exports.ChatInfo = ChatInfo;
module.exports.validate = validatechatInfoSchema;
