const express = require('express');
const auth = require('../middleware/auth');
const getUser = require('../middleware/getUser');
const {
  getNeighbour,
  getEmployee,
  validateSameNeighbourOrEmployee,
  validateNewProposalBody,
  validateAcceptProposal,
  validateFinalizeProposal,
  validateDeleteProposal
} = require('../middleware/proposalsMiddleware');
const router = express.Router();
const ProposalService = require('../services/proposalService');

const proposalService = new ProposalService();

router.get(
  '/:neighbourId/:employeeId',
  [auth, getUser, getNeighbour, getEmployee, validateSameNeighbourOrEmployee],
  async (req, res) => {
    const { neighbour, employee } = req;

    const proposal = await proposalService.getProposal(neighbour, employee);

    if (!proposal) return res.status(400).send('No existe contratacion');

    res.status(200).send(proposal);
  }
);

router.post('/', [auth, getUser, validateNewProposalBody], async (req, res) => {
  var proposal = await proposalService.createProposal(req.body, req.chatInfo);

  if (!proposal)
    return res.status(400).send('No se pudo crear la contratacion');

  res.status(200).send(proposal);
});

router.patch(
  '/:proposalId/accept',
  [auth, getUser, validateAcceptProposal],
  async (req, res) => {
    var { proposal } = req;

    proposal = await proposalService.updateProposalState(proposal, 'ACCEPT');

    if (!proposal)
      return res.status(400).send('No se pudo aceptar la contratacion');

    res.status(200).send(proposal);
  }
);

router.patch(
  '/:proposalId/finalize',
  [auth, getUser, validateFinalizeProposal],
  async (req, res) => {
    var { proposal } = req;

    proposal = await proposalService.finalizeProposal(proposal);

    if (!proposal)
      return res.status(400).send('No se pudo finalizar la contratacion');

    res.status(200).send(proposal);
  }
);

router.delete(
  '/:proposalId',
  [auth, getUser, validateDeleteProposal],
  async (req, res) => {
    var { proposal } = req;

    proposal = await proposalService.deleteProposal(proposal);

    if (!proposal)
      return res.status(400).send('No se pudo eliminar la contratacion');

    res.status(200).send(proposal);
  }
);

module.exports = router;
