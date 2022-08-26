const { Neighborhood } = require('../models/neighborhood');
const { Neighbour } = require('../models/neighbour');
const { Employee } = require('../models/employee');
const { ChatInfo } = require('../models/chatInfo');
const mongoose = require('mongoose');

const validateGetChats = async (req, res, next) => {
  const { _provider, _receiver } = req.params;
  const { user } = req;

  if (
    (user.employee && user.employee._id.toString() !== _provider) ||
    (user.neighbour && user.neighbour._id.toString() !== _receiver)
  )
    return res.status(403).send('No tienes permisos para ver este chat');

  const receiver = await Neighbour.findOne({ _id: _receiver });
  const provider = await Employee.findOne({ _id: _provider });

  if (!receiver && !provider)
    return res.status(400).send('No se encontro el usuario');

  next();
};

const validateCreateChat = async (req, res, next) => {
  const { _provider, _receiver, content } = req.body;

  if (content.chatMessage === '')
    return res.status(404).send('El mensaje no puede estar vacio');

  if (
    !mongoose.Types.ObjectId.isValid(content.userId) ||
    !mongoose.Types.ObjectId.isValid(_provider) ||
    !mongoose.Types.ObjectId.isValid(_receiver)
  )
    return res.status(400).send('El usuario no es valido');
  next();
};

module.exports = {
  validateGetChats,
  validateCreateChat
};
