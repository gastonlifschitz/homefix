const { Message } = require('../models/messages');
const { Neighborhood } = require('../models/neighborhood');
const mongoose = require('mongoose');

const deleteMessage = async (neighborhood, messageId) => {
  const message = await Message.findOneAndDelete({
    _neighborhood: neighborhood,
    _id: mongoose.Types.ObjectId(messageId)
  });

  neighborhood = await Neighborhood.findOne({ _id: neighborhood });

  neighborhood.messages.pull(mongoose.Types.ObjectId(messageId));

  await neighborhood.save();

  return message;
};

module.exports = { deleteMessage };
