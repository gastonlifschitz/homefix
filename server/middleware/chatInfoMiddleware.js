const { validate } = require('../models/chatInfo');
const { Neighbour } = require('../models/neighbour');
const { Employee } = require('../models/employee');

const validateNewChatInfo = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { _provider, _receiver } = req.body;

  var employee = await Employee.findOne({ _id: _provider });
  if (!employee) return res.status(404).send('No existe un empleado valido');

  var neighbour = await Neighbour.findOne({ _id: _receiver });
  if (!neighbour) return res.status(404).send('No existe un vecino valido');

  if (req.user.neighbour._id !== neighbour._id)
    return res.status(404).send('No sos este vecino');

  if (req.user.employee._id === employee._id)
    return res.status(404).send('No podes chatear con vos mismo');

  next();
};

module.exports = {
  validateNewChatInfo
};
