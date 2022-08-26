const { validate } = require('../models/admin');
const { UserGallery } = require('../models/userGallery');
const { User } = require('../models/user');
const { Admin, validateEdit } = require('../models/admin');
const bcrypt = require('bcrypt');
const { sendMailAccountVerification } = require('../utils/mail');
const {
  createAdminValidateRequest
} = require('../middleware/adminMiddlewares');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const auth = require('../middleware/auth');
const matchesId = require('../middleware/matchesId');
const {
  validateNeigbhorhoodCreation
} = require('../middleware/neighborhoodMiddleware');

//Solo yo quiero ver mi perfil
router.get('/:id', [auth, matchesId], async (req, res) => {
  const { id: _id } = req.params;
  let admin = await Admin.findOne({ _id }).lean();

  if (!admin) return res.status(400).send();

  res.status(200).send(admin);
});

router.post(
  '/',
  [createAdminValidateRequest, validateNeigbhorhoodCreation],
  async (req, res) => {
    const { password, email, profilePic, address, neighborhood } = req.body;
    const bodyAdmin = _.omit(req.body, [
      'password',
      'profilePic',
      'join',
      'role',
      'neighborhood',
      'address'
    ]);

    const { error } = validate(bodyAdmin);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await User.findOne({ email });

    if (admin)
      return res.status(400).send('El usuario ya se encuentra registrado.');
    admin = bodyAdmin;

    let user = {
      email,
      admin: true,
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
      admin,
      neighborhood: { address, name: neighborhood }
    });

    return res.status(200).send(admin);
  }
);

router.put('/:id', [auth, matchesId], async (req, res) => {
  const { error } = validateEdit(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  await Admin.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then((result) => res.status(200).json(req.body))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get(
  '/profilePic/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;

    const { email } = await Admin.findById(id);

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

module.exports = router;
