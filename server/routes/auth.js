const { User } = require('../models/user');
const { resetPasswordMail } = require('../utils/mail');
const { createUser } = require('../utils/users');
const { resetPasswordTemplate } = require('../emails/templates');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models/employee');
const { UserGallery } = require('../models/userGallery');

router.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).send(`El usuario no existe.`);

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(401).send('La contraseña es incorrecta.');

  if (user.employee) {
    let employee = await Employee.findOne({ _id: user.employee });
    if (employee.blackList)
      return res.status(400).send('El usuario se encuentra bloqueado.');
  }

  const token = user.generateAuthToken();

  console.log('Logged in!! here is the token', token);
  return res.status(200).send({ auth: 'ok', token });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.status(404).send('Usuario no encontrado');

  const { _id } = user;
  const token = jwt.sign({ _id }, process.env.RESET_PASSWORD_KEY);
  await User.findOneAndUpdate({ email }, { resetLink: token });
  const emailTemplate = resetPasswordTemplate(config, token);
  const emailData = {
    from: 'ayudahomefix@gmail.com',
    to: email,
    subject: 'Recuperar contraseña',
    // ${process.env.CLIENT_URL}/resetPassword/${token}
    html: emailTemplate
  };

  const info = await resetPasswordMail(emailData);
  if (!info) return res.status(400).send('Problema con envio de mail');

  return res.status(200).send({ emailSent: true, message: 'Mail enviado' });
});

router.post('/reset-password', async (req, res) => {
  const { resetLink, newPassword } = req.body;

  if (!resetLink) return res.status(401).send('No reset link present');

  const verification = jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY);

  if (!verification) return res.status(401).send('Token incorrecto');

  let user = await User.findOne({ resetLink });

  if (!user) return res.status(401).send('Usuario con este token no existe');

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetLink = '';

  await user.save();
  return res.status(200).send({ changed: true });
});

router.post('/email-activate', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('No hay token');

  const decodedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATE);
  if (!decodedToken) return res.status(401).send('Token incorrecto');

  let { user } = decodedToken;
  const { email } = user;

  let userExists = await User.findOne({ email });
  if (userExists) return res.status(404).send('Usuario ya existe');

  const userType = await createUser(decodedToken);

  if (!userType) {
    await UserGallery.deleteOne({ email });

    return res
      .status(404)
      .send(
        'Ocurrio un error. Por favor registrese nuevamente o contacte con el administrador.'
      );
  }

  var admin, neighbour, employee;
  admin = userType.admin ? userType.admin._id : undefined;
  employee = userType.employee ? userType.employee._id : undefined;
  neighbour = userType.neighbour ? userType.neighbour._id : undefined;

  user = new User({ ...user, admin, neighbour, employee });
  await user.save();

  return res.status(200).send({ created: true });
});

module.exports = router;
