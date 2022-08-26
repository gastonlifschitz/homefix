const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);

const proposalSchema = new Schema(
  {
    price: { type: Number, required: true },
    chatId: { type: ObjectId, required: true, ref: 'ChatInfo' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    _receiver: { type: ObjectId, required: true, ref: 'Neighbour' },
    _provider: { type: ObjectId, required: true, ref: 'Employee' },
    serviceType: {
      type: String,
      enum: config.get('areaTypes'),
      upperCase: true,
      trim: true
    },
    state: {
      type: String,
      enum: config.get('proposalStates'),
      upperCase: true,
      trim: true,
      default: 'WAIT'
    },
    _review: { type: ObjectId, ref: 'Review' }
  },
  { timestamps: true }
);

const Proposal = mongoose.model('Proposal', proposalSchema);

function validateProposalSchema(proposal) {
  const schema = Joi.object({
    price: Joi.number().min(0).required(),
    _receiver: Joi.any().required(),
    _provider: Joi.any().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    serviceType: Joi.any().valid(...config.get('areaTypes')),
    state: Joi.any().valid(...config.get('proposalStates')),
    _review: Joi.any()
  });

  return schema.validate(proposal);
}

module.exports.Proposal = Proposal;
module.exports.validate = validateProposalSchema;
