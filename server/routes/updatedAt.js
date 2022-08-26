const { Employee } = require('../models/employee');
const { Neighbour } = require('../models/neighbour');
const express = require('express');
const auth = require('../middleware/auth');
const getUser = require('../middleware/getUser');
const router = express.Router();

router.post('/', [auth, getUser], async (req, res) => {
  const user = req.user;
  if (user.employee) {
    await Employee.updateOne(
      { _id: user.employee._id },
      { $set: { updatedAt: new Date() } }
    );
  }
  if (user.neighbour) {
    await Neighbour.updateOne(
      { _id: user.neighbour._id },
      { $set: { updatedAt: new Date() } }
    );
  }
  return res.status(200).send('Success Updated At');
});

module.exports = router;
