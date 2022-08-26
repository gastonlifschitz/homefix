const { Message } = require('../models/messages');
const { Neighborhood } = require('../models/neighborhood');

const messageFromNeighborhood = async (req, res, next) => {
  const { neighborhood, messageId } = req.body;

  const neig = await Neighborhood.findOne({ name: neighborhood });

  if (!neig) return res.status(404).send('No existe ese grupo');

  const message = await Message.findOne({
    _id: messageId,
    _neighborhood: neig._id
  });

  if (!message) return res.status(404).send('No existe ese mensaje');

  req.body.neighborhood = neig._id;

  next();
};

const moveParamsToBody = (req, res, next) => {
  req.body = {
    ...req.body,
    ...req.params
  };
  next();
};

module.exports = {
  messageFromNeighborhood,
  moveParamsToBody
};
