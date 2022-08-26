const { validate } = require('../models/neighborhood');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNeighborhood,
  createNeighborhood,
  addUserToNeighborhood,
  deleteNeighbourFromNeighborhood,
  addAdminToNeighborhood,
  leaveNeighborhoodAsAdmin,
  addNeighbourToNeighborhood
} = require('../services/neighborhoodService');
const getUser = require('../middleware/getUser');
const isAdminOrSelf = require('../middleware/isAdminOrSelf');
const emailExists = require('../middleware/emailExists');
const neighborhoodExists = require('../middleware/neighborhoodExists');
const isAdminFromNeighborhood = require('../middleware/isAdminFromNeighborhood');
const { moveParamsToBody } = require('../middleware/messageMiddleware');
const {
  validateLeaveNeighborhoodAsAdmin,
  validateNeigbhorhoodCreation,
  nameToNeighborhood
} = require('../middleware/neighborhoodMiddleware');
const {
  neighbourAlreadyInNeighborhood
} = require('../middleware/neighbourMiddlewares');
const _ = require('lodash');

router.get('/' /*, auth*/, async (req, res) => {
  const { name } = req.query;

  var neighborhood = await getNeighborhood(name);

  res.status(200).send(neighborhood);
});

//crear un vecindario agregandole al user el role correspondiente
router.post(
  '/',
  [auth, getUser, nameToNeighborhood, validateNeigbhorhoodCreation],
  async (req, res) => {
    const { error } = validate(_.omit(req.body, ['neighborhood']));
    if (error) return res.status(400).send(error.details[0].message);

    let neighborhood = await createNeighborhood(
      _.omit(req.body, ['neighborhood'])
    );
    if (!neighborhood)
      return res.status(401).send("Couldn't create neighborhood");

    await addAdminToNeighborhood(neighborhood, req.user);
    await addNeighbourToNeighborhood(neighborhood, req.user);
    res.status(200).send(neighborhood);
  }
);

//Agregar un vecino a un vecindario
router.post(
  '/add-user',
  [auth, getUser, neighborhoodExists, neighbourAlreadyInNeighborhood],
  async (req, res) => {
    let { admin, neighbour } = req.user;
    let { neighborhood, role } = req.body;
    if (!neighborhood) return res.status(401).send('Falta grupo');
    neighborhood = await addUserToNeighborhood(
      neighborhood,
      role,
      admin,
      neighbour,
      req.user
    );

    if (!neighborhood) return res.status(401).send('Something happend');
    res.status(200).send(neighborhood);
  }
);

router.delete(
  '/:neighborhood/neighbour/:neigbhourId',
  [auth, getUser, isAdminOrSelf],
  async (req, res) => {
    const { neighborhood: neighborhoodId, neigbhourId } = req.params;
    let { admin } = req.user;
    if (!neighborhoodId || !neigbhourId) return res.status(401).send();

    const neighborhood = await deleteNeighbourFromNeighborhood(
      admin,
      neighborhoodId,
      neigbhourId,
      req.leaveNeighborhood
    );
    if (!neighborhood) return res.status(401).send('Something happend');
    res.status(200).send(neighborhood);
  }
);

router.put(
  '/add-admin',
  [auth, getUser, isAdminFromNeighborhood, emailExists, neighborhoodExists],
  async (req, res) => {
    const { targetUser, targetNeighborhood } = req;
    const neighborhood = await addAdminToNeighborhood(
      targetNeighborhood,
      targetUser
    );
    if (!neighborhood)
      return res.status(401).send('No se pudo agregar el admin al grupo');
    res.status(200).send(neighborhood);
  }
);

router.delete(
  '/:neighborhood/admin/:adminId',
  [
    auth,
    getUser,
    moveParamsToBody,
    isAdminFromNeighborhood,
    validateLeaveNeighborhoodAsAdmin
  ],
  async (req, res) => {
    const { neighborhood, adminId } = req.params;

    const exitedNeighborhood = await leaveNeighborhoodAsAdmin(
      neighborhood,
      adminId
    );

    if (!exitedNeighborhood) return res.status(401).send('Somehting happend');
    res.status(200).send(exitedNeighborhood);
  }
);

module.exports = router;
