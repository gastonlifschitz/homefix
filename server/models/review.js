const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const reviewSchema = new Schema({
  comment: { type: String, minlength: 0, maxLength: 300, trim: true },
  _issuer: { type: ObjectId, ref: 'Neighbour', required: true },
  rating: { type: Number, required: true },
  _employee: { type: ObjectId, ref: 'Employee', required: true },
  timestamp: { type: Date, default: Date.now },
  report: { type: Boolean, default: false, required: true },
  reports: [{ type: ObjectId, ref: 'User', required: true }],
  likes: [{ type: ObjectId, ref: 'User' }],
  disLikes: [{ type: ObjectId, ref: 'User' }]
});

const Review = mongoose.model('Review', reviewSchema);

function validateReviewSchema(review) {
  const schema = Joi.object({
    comment: Joi.string().max(300).min(0),
    rating: Joi.number().min(0).max(5),
    _issuer: Joi.objectId(),
    _employee: Joi.objectId().required(),
    report: Joi.boolean().required(),
    likes: Joi.array(),
    disLikes: Joi.array()
  });

  return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validate = validateReviewSchema;
