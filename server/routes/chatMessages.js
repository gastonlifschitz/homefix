const express = require('express');
const router = express.Router();
const { ChatMessage } = require('../models/chatMessage');
const { ChatInfo } = require('../models/chatInfo');
const mongoose = require('mongoose');
const getUser = require('../middleware/getUser');
const auth = require('../middleware/auth');
const {
  validateCreateChat,
  validateGetChats
} = require('../middleware/chatMessagesMiddleware');

router.get(
  '/getChats/:_provider/:_receiver',
  [auth, getUser, validateGetChats],
  async (req, res) => {
    const { _provider, _receiver } = req.params;

    var chatId = await ChatInfo.findOne({ _provider, _receiver });

    if (!chatId) {
      const chatInfo = new ChatInfo({ _provider, _receiver });
      await chatInfo.save();
      chatId = { _id: chatInfo._id };
    }

    await ChatMessage.find({ chatId: chatId._id })
      .populate('sender')
      .exec((err, chats) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(chats);
      });
  }
);

router.post('/', [auth, getUser, validateCreateChat], async (req, res) => {
  const { _provider, _receiver, content } = req.body;

  var chatId = await ChatInfo.findOne({ _provider, _receiver });
  if (!chatId) {
    chatId = new ChatInfo({ _provider, _receiver });
    await chatId.save();
  }

  const chat = new ChatMessage({
    message: content.chatMessage ? content.chatMessage : content.image,
    sender: mongoose.Types.ObjectId(content.userId),
    type: content.type,
    userType: content.userType,
    chatId: chatId._id
  });

  await chat.save();

  res.status(200).send(chat);
});

module.exports = router;
