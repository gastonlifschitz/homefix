const { Proposal } = require('../models/proposal');

class NeighbourService {
  getProposals = async (_receiver) => {
    const waitingProposals = await Proposal.find({
      _receiver,
      state: 'WAIT'
    })
      .populate('_provider')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    const acceptedProposals = await Proposal.find({
      _receiver,
      state: 'ACCEPT'
    })
      .populate('_provider')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    const finalizedProposals = await Proposal.find({
      _receiver,
      state: 'FINALIZED'
    })
      .populate('_provider')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    return {
      waitingProposals,
      acceptedProposals,
      finalizedProposals
    };
  };
}

module.exports = NeighbourService;
