const { User } = require('../models/user');

module.exports = async function (req, res, next) {
  if (!req.user) return res.status(400).send('no user provided');

  var user = await User.findOne({ _id: req.user._id })
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
