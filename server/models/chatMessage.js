const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const chatMessageSchema = new Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: Schema.Types.ObjectId,
      refPath: 'userType',
      required: true
    },
    userType: {
      type: String,
      required: true,
      enum: ['Employee', 'Neighbour']
    },
    type: {
      type: String
    },
    chatId: { type: ObjectId, ref: 'ChatInfo', required: true }
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports.ChatMessage = ChatMessage;
