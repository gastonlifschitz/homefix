const { Proposal } = require('../models/proposal');

const validateCreateReview = async (req, res, next) => {
  const { id: proposalId } = req.params;
  const user = req.user;
  const review = req.body;

  const proposal = await Proposal.findOne({ _id: proposalId });
  if (!proposal) return res.status(400).send('No existe esa contratacion');

  if (proposal.review) return res.status(400).send('Ya se hizo esa reseña');

  if (proposal.state !== 'FINALIZED')
    return res.status(400).send('No se puede realizar la reseña');

  if (
    !(
      user.neighbour &&
      proposal._receiver.toString() === user.neighbour._id.toString()
    )
  )
    return res.status(404).send('No tenes permisos para realizar esta reseña');

  if (review._employee !== proposal._provider.toString())
    return res.status(404).send('No es una reseña para este empleado');

  if (review.rating === 0) {
    return res.status(404).send('Complete rating para el empleado');
  }
  req.proposal = proposal;

  next();
};

module.exports = {
  validateCreateReview
};
