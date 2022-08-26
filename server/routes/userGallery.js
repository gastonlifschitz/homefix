//const auth = require("../middleware/auth");

const { User } = require('../models/user');
// const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const { UserGallery } = require('../models/userGallery');

router.put('/profilePic/:id', async (req, res) => {
  const { id } = req.params;
  const { profilePic } = req.body;

  const { email } = await User.findById(id);

  await UserGallery.findOneAndUpdate({ email }, { profilePic });

  res.status(201).send({ status: 'success' });
});

module.exports = router;
