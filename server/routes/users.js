const { User } = require('../models/user');
// const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchesId = require('../middleware/matchesId');
const { getProfilePic } = require('../services/userService');

router.get('/:id', [auth, matchesId], async (req, res) => {
  const { id: _id } = req.params;
  let user = await User.findOne({ _id })
    .lean()
    .populate('admin')
    .populate('employee')
    .lean()
    .populate('rubros')
    .populate('neighbour');
  if (!user) return res.status(400).send();

  res.status(200).send(user);
});

router.get('/profilePic/:id', async (req, res) => {
  const { id } = req.params;

  const profilePic = await getProfilePic(id);

  if (!profilePic) return res.status(404).send(null);

  res.send(profilePic);
});

router.get('/' /*, auth*/, async (req, res) => {
  const user = await User.find().sort({ updated: 'desc' });
  console.log('Getting all users...');
  res.send(user);
});

router.get('/status' /*, auth*/, async (req, res) => {
  res.status(200).send('Alive');
});

module.exports = router;
