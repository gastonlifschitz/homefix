const { ChatInfo } = require('../models/chatInfo');
const { Employee } = require('../models/employee');
const { Neighbour } = require('../models/neighbour');
const { Proposal, validate } = require('../models/proposal');
const mongoose = require('mongoose');

const getNeighbour = async (req, res, next) => {
  const { neighbourId } = req.params;

  const neighbour = await Neighbour.findOne({ _id: neighbourId });

  if (!neighbour) return res.status(404).send('No se encontro ese vecino');

  req.neighbour = neighbour;

  next();
};

const getEmployee = async (req, res, next) => {
  const { employeeId } = req.params;

  const employee = await Employee.findOne({ _id: employeeId });

  if (!employee) return res.status(404).send('No se encontro ese empleado');

  req.employee = employee;

  next();
};

const validateSameNeighbourOrEmployee = (req, res, next) => {
  const { user, neighbour, employee } = req;

  if (user.neighbour && user.neighbour._id.equals(neighbour._id)) {
    return next();
  }

  if (user.employee && user.employee._id.equals(employee._id)) {
    return next();
  }

  return res.status(404).send('No sos este usuario');
};

const validateNewProposalBody = async (req, res, next) => {
  const { user } = req;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const proposal = req.body;
  const { _receiver, _provider } = proposal;

  if (user.employee._id.toString() !== _provider)
    return res.status(400).send('No estas autorizado');

  const provider = await Employee.findOne({
    _id: mongoose.Types.ObjectId(_provider)
  });
  if (!provider) return res.status(404).send('No se encontro el empleado');

  const receiver = await Neighbour.findOne({
    _id: mongoose.Types.ObjectId(_receiver)
  });
  if (!receiver) return res.status(404).send('No se encontro el vecino');

  const chat = await ChatInfo.findOne({
    _receiver,
    _provider
  });
  if (!chat) return res.status(404).send('No se encontro el chat');

  // Chequear que no existe un proposal con mismo receiver y provider
  const existingProposal = await Proposal.findOne({
    _receiver,
    _provider,
    state: { $ne: 'FINALIZED' }
  });
  if (existingProposal)
    return res.status(404).send('Ya existe una contratacion en curso');

  req.chatInfo = chat;

  next();
};

const validateAcceptProposal = async (req, res, next) => {
  const { user } = req;
  const { proposalId } = req.params;

  const proposal = await Proposal.findOne({ _id: proposalId });
  if (!proposal) return res.status(404).send('No existe esa contratacion');

  if (user.neighbour && !proposal._receiver.equals(user.neighbour._id))
    return res.status(404).send('Esta contratacion no es para usted');

  if (proposal.state !== 'WAIT')
    return res.status(404).send('Este presupuesto ya fue aceptada');

  req.proposal = proposal;

  next();
};

const validateFinalizeProposal = async (req, res, next) => {
  const { user } = req;
  const { proposalId } = req.params;

  const proposal = await Proposal.findOne({ _id: proposalId });
  if (!proposal) return res.status(404).send('No existe esa contratacion');

  if (
    (user.employee && !proposal._provider.equals(user.employee._id)) ||
    (user.neighbour && !proposal._receiver.equals(user.neighbour._id))
  )
    return res.status(404).send('Esta contratacion no es para usted');

  if (proposal.state !== 'ACCEPT')
    return res.status(404).send('Este presupuesto no puede ser finalizada');

  req.proposal = proposal;

  next();
};

const validateDeleteProposal = async (req, res, next) => {
  const { user } = req;
  const { proposalId } = req.params;

  const proposal = await Proposal.findOne({ _id: proposalId });
  if (!proposal) return res.status(404).send('No existe esa contratacion');

  if (
    (user.employee && !proposal._provider.equals(user.employee._id)) ||
    (user.neighbour && !proposal._receiver.equals(user.neighbour._id))
  )
    return res.status(404).send('Esta contratacion no es para usted');

  if (proposal.state !== 'WAIT')
    return res.status(404).send('Este presupuesto no puede ser cancelada');

  req.proposal = proposal;

  next();
};

module.exports = {
  getNeighbour,
  getEmployee,
  validateSameNeighbourOrEmployee,
  validateNewProposalBody,
  validateAcceptProposal,
  validateFinalizeProposal,
  validateDeleteProposal
};
