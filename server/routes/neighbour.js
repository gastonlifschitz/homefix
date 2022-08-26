const { Neighbour, validate, validateEdit } = require('../models/neighbour');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const { sendMailAccountVerification } = require('../utils/mail');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const getUser = require('../middleware/getUser');
const config = require('config');
const matchesId = require('../middleware/matchesId');
const { UserGallery } = require('../models/userGallery');
const auth = require('../middleware/auth');
const neighborhoodExists = require('../middleware/neighborhoodExists');
const NeighbourService = require('../services/neighbourService');
const {
  validateIsSameNeighbour
} = require('../middleware/neighbourMiddlewares');
const { Neighborhood } = require('../models/neighborhood');

const neighbourService = new NeighbourService();

// Get all neighbours i have
router.get('/', [auth, getUser], async (req, res) => {
  const neighbour = req.user.neighbour;
  if (!neighbour) return res.status(400).send('No tenes vecinos');

  const neighbours = [];

  for (let neighborhood of neighbour.neighborhoods) {
    neighborhood = await Neighborhood.findOne({ _id: neighborhood });
    const { neighbours: neigh } = neighborhood;

    for (let n of neigh) {
      neighbours.push(n);
    }
  }

  res.status(200).send(neighbours);
});

//Solo yo quiero ver mi perfil
router.get('/:id', [auth, matchesId], async (req, res) => {
  const { id: _id } = req.params;
  let neighbour = await Neighbour.findOne({ _id }).lean();
  if (!neighbour) return res.status(400).send();

  res.status(200).send(neighbour);
});

router.post('/', neighborhoodExists, async (req, res) => {
  const {
    password,
    email,
    profilePic,
    neighborhood: neighborhoodName
  } = req.body;
  const bodyNeighbour = _.omit(req.body, [
    'password',
    'profilePic',
    'role',
    'neighborhood'
  ]);
  if (!neighborhoodName)
    return res.status(400).send('Se necesita ingresar un grupo');

  const { error } = validate(bodyNeighbour);
  if (error) return res.status(400).send(error.details[0].message);

  let neighbour = await User.findOne({ email });
  if (neighbour)
    return res.status(400).send('El usuario ya se encuentra registrado.');

  neighbour = bodyNeighbour;

  let user = {
    email,
    neighbour: true,
    password
  };

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  let { password: passwordToEncrypt } = user;
  passwordToEncrypt = await bcrypt.hash(passwordToEncrypt, salt);
  user.password = passwordToEncrypt;

  const userGallery = new UserGallery({ email, profilePic });
  await userGallery.save();

  sendMailAccountVerification(email, {
    user,
    neighbour,
    neighborhood: neighborhoodName
  });

  return res.status(200).send(neighbour);
});

router.put('/:id', [auth, matchesId], async (req, res) => {
  const { error } = validateEdit(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  await Neighbour.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then((result) => {
      res.status(200).json(req.body);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get(
  '/profilePic/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;

    const { email } = await Neighbour.findById(id);

    const userGallery = await UserGallery.findOne({ email });

    if (userGallery.profilePic) {
      res.send(
        Buffer.from(userGallery.profilePic.split(';base64,')[1], 'base64')
      );
      return;
    }

    res.status(404).send(null);
  }
);

router.get(
  '/proposals/:id',
  [auth, getUser, validateIsSameNeighbour],
  async (req, res, next) => {
    const { id } = req.params;

    const proposals = await neighbourService.getProposals(id);

    res.status(200).send(proposals);
  }
);

module.exports = router;
