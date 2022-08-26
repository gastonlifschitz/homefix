const { SuperAdmin } = require('../models/superAdmin');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  let superAdmin = await SuperAdmin.findOne({ email: req.body.email });

  if (!superAdmin) return res.status(404).send(`El usuario no existe.`);

  const validPassword = await bcrypt.compare(
    req.body.password,
    superAdmin.password
  );

  if (!validPassword)
    return res.status(401).send('La contraseña es incorrecta.');

  const token = superAdmin.generateAuthToken();

  console.log('Logged in!! here is the token', token);
  return res.status(200).send({ auth: 'ok', token });
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  let superAdmin = await SuperAdmin.findOne({ email });

  if (superAdmin)
    return res.status(400).send('El email ya se encuentra registrado.');

  superAdmin = {
    email,
    password
  };

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  let { password: passwordToEncrypt } = superAdmin;
  passwordToEncrypt = await bcrypt.hash(passwordToEncrypt, salt);
  superAdmin.password = passwordToEncrypt;

  superAdmin = new SuperAdmin(superAdmin);
  await superAdmin.save();

  return res.status(200).send(superAdmin);
});

module.exports = router;
