const express = require('express');
const router = express.Router();
const { ChatInfo } = require('../models/chatInfo');
const getUser = require('../middleware/getUser');
const auth = require('../middleware/auth');
const { validateNewChatInfo } = require('../middleware/chatInfoMiddleware');
const mongoose = require('mongoose');

router.post('/', [auth, getUser, validateNewChatInfo], async (req, res) => {
  const chatInfo = new ChatInfo(req.body);

  await chatInfo.save();

  return res.status(200).send(chatInfo);
});

router.get('/employee/:employee', [auth, getUser], async (req, res) => {
  const { employee } = req.params;
  const chatInfoArray = await ChatInfo.find({
    _provider: mongoose.Types.ObjectId(employee)
  }).populate('_receiver');

  return res.status(200).send(chatInfoArray);
});

router.get('/neighbour/:neighbour', [auth, getUser], async (req, res) => {
  const { neighbour } = req.params;
  const chatInfoArray = await ChatInfo.find({
    _receiver: mongoose.Types.ObjectId(neighbour)
  }).populate('_provider');

  return res.status(200).send(chatInfoArray);
});

module.exports = router;
