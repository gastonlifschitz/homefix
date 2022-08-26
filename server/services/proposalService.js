const { Employee } = require('../models/employee');
const { Proposal } = require('../models/proposal');

class ProposalService {
  getProposal = async (neighbour, employee) => {
    const proposal = await Proposal.findOne({
      _receiver: neighbour._id,
      _provider: employee._id
    })
      .populate('chatId')
      .populate('_provider')
      .populate('_review');

    return proposal;
  };

  createProposal = async (proposal, chatInfo) => {
    var prop = new Proposal(proposal);


    prop.chatId = chatInfo._id;

    await prop.save();

    return prop;
  };

  updateProposalState = async (proposal, state) => {
    proposal.state = state;

    return await proposal.save();
  };

  finalizeProposal = async (proposal) => {
    proposal = await this.updateProposalState(proposal, 'FINALIZED');

    let employee = await Employee.findOne({ _id: proposal._provider });

    console.log(employee);

    if (!employee) return;

    if (!employee.workedFor) employee.workedFor = [];

    employee.workedFor.addToSet(proposal._receiver);

    console.log(employee);

    await employee.save();

    return proposal;
  };

  deleteProposal = async (proposal) => {
    return await Proposal.findOneAndDelete({ _id: proposal._id });
  };
}

module.exports = ProposalService;
