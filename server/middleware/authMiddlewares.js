const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const { SuperAdmin } = require('../models/superAdmin');

const getOptionalAuth = async (req, res, next) => {
  const token = req.header('pf-token');

  if (!config.get('requiresAuth') || !token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    // next();
  } catch (error) {
    return res.status(400).send('Token inválido');
  }

  next();
};

const getOptionalUser = async (req, res, next) => {
  if (!req.user) return next();

  var user = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) })
    .lean()
    .populate('admin')
    .populate('employee')
    .lean()
    .populate('rubros')
    .populate('neighbour');

  if (!user) return res.status(400).send('no user provided');

  req.user = user;

  next();
};

const validateSuperAdmin = async (req, res, next) => {
  if (!req.user) return res.status(400).send('no user provided');

  var user = await SuperAdmin.findOne({ _id: req.user._id });

  if (!user) return res.status(400).send('no user provided');

  req.user = user;

  next();
};

module.exports = {
  getOptionalUser,
  getOptionalAuth,
  validateSuperAdmin
};
