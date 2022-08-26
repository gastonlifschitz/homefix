const nodemailer = require('nodemailer');
const config = require('config');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const jwt = require('jsonwebtoken');
const {
  notificationTemplate,
  activationTemplate
} = require('../emails/templates');

async function resetPasswordMail(emailInfo) {
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.API_KEY_SENDGRID
    })
  );

  let info = await transport.sendMail(emailInfo);

  return info;
}

async function sendMailAccountVerification(email, schema) {
  console.log('Sending mail to: ', email);

  const token = jwt.sign(schema, process.env.JWT_ACCOUNT_ACTIVATE);
  const emailTemplate = activationTemplate(config, token);

  const emailData = {
    from: 'ayudahomefix@gmail.com',
    to: email,
    subject: 'Activacion de la cuenta',
    html: emailTemplate
  };

  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.API_KEY_SENDGRID
    })
  );

  let info = await transport.sendMail(emailData);

  return info;
}

async function sendMailAdminNotification(
  email,
  { neighbour, neighborhood, admin }
) {
  const emailTemplate = notificationTemplate(
    neighborhood.name,
    neighbour,
    admin
  );
  const emailData = {
    from: 'ayudahomefix@gmail.com',
    to: email,
    subject: 'Un usuario entro a tu grupo',
    html: emailTemplate
  };

  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.API_KEY_SENDGRID
    })
  );

  let info = await transport.sendMail(emailData);

  return info;
}

exports.resetPasswordMail = resetPasswordMail;
exports.sendMailAdminNotification = sendMailAdminNotification;
exports.sendMailAccountVerification = sendMailAccountVerification;
