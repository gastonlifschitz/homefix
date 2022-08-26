// const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const isAdminFromNeighborhood = require('../middleware/isAdminFromNeighborhood');
const getUser = require('../middleware/getUser');
const auth = require('../middleware/auth');
const {
  messageFromNeighborhood,
  moveParamsToBody
} = require('../middleware/messageMiddleware');
const { deleteMessage } = require('../services/messageService');
const { sendMessage } = require('../services/neighborhoodService');

router.post(
  '/send-message',
  [auth, getUser, isAdminFromNeighborhood],
  async (req, res) => {
    const payload = req.body;
    const { neighborhood, message, title, date } = payload;
    let { admin } = req.user;

    if (!neighborhood || !admin) return res.status(401).send();

    const messageCreated = await sendMessage(admin, neighborhood, {
      message,
      title,
      date
    });

    if (!messageCreated)
      return res.status(401).send("Neighborhood doesn't exist");
    res.status(200).send(messageCreated);
  }
);

router.delete(
  '/:messageId/neighborhood/:neighborhood',
  [
    auth,
    getUser,
    moveParamsToBody,
    isAdminFromNeighborhood,
    messageFromNeighborhood
  ],
  async (req, res) => {
    const { neighborhood, messageId } = req.body;

    const message = await deleteMessage(neighborhood, messageId);

    if (!message) return res.status(401).send('Algo sucedio');
    res.status(200).json({ messageDeleted: true });
  }
);

module.exports = router;
