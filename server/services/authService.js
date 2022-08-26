const { Neighborhood } = require('../models/neighborhood');

const createNeighborhood = async (neighborhoodName, address) => {
  var neighborhood = await Neighborhood.findOne({ name: neighborhoodName });

  if (!neighborhood) {
    neighborhood = new Neighborhood({ name: neighborhoodName, address });
    if (!neighborhood) return false;
    try {
      await neighborhood.save();
    } catch (error) {
      return false;
    }
    return true;
  }
  return false;
};

module.exports = { createNeighborhood };
