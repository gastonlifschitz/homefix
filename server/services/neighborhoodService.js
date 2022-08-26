const { Neighborhood, validate } = require('../models/neighborhood');
const config = require('config');
const { sendMailAdminNotification } = require('../utils/mail');
const { addRoleToUser } = require('./userService');
const { Neighbour } = require('../models/neighbour');
const mongoose = require('mongoose');
const { Admin } = require('../models/admin');
const { Message } = require('../models/messages');

//TOOD: implement expand
const getNeighborhood = async (name) => {
  var neighborhood = await Neighborhood.findOne({ name })
    .lean()
    .populate('neighbours')
    .populate('admins')
    .lean()
    .populate('workers')
    .populate('blackList')
    .lean()
    .populate('messages')
    .catch(() => null);

  if (!neighborhood)
    neighborhood = await Neighborhood.findOne({ _id: name })
      .lean()
      .populate('neighbours')
      .populate('admins')
      .lean()
      .populate('workers')
      .populate('blackList')
      .lean()
      .populate('messages')
      .catch(() => null);

  return neighborhood;
};

const createNeighborhood = async (body, res) => {
  let neighborhood = new Neighborhood(body);
  neighborhood = await neighborhood.save();

  return neighborhood;
};

const addUserToNeighborhood = async (
  neighborhoodName,
  role,
  admin,
  neighbour,
  user
) => {
  var neighborhood = await Neighborhood.findOne({ name: neighborhoodName });
  if (role === config.get('roles').NEIGHBOUR.db_name) {
    if (!neighbour) neighbour = await addRoleToUser(user, role);
    else {
      neighbour = await Neighbour.findOne({ email: neighbour.email });
    }
    if (neighbour.neighborhoods) {
      neighbour.neighborhoods.addToSet(neighborhood._id);
    } else neighbour.neighborhoods = [neighborhood._id];

    await neighbour.save();

    neighborhood.neighbours.addToSet(neighbour._id);
  } else if (role === config.get('roles').ADMIN.db_name) {
    if (!admin) admin = await addRoleToUser(user, role);
    else {
      admin = await Admin.findOne({ email: admin.email });
    }
    if (admin.neighborhoods) admin.neighborhoods.addToSet(neighborhood._id);
    else admin.neighborhoods = [neighborhood._id];

    await admin.save();

    neighborhood.admins.addToSet(admin._id);
  }

  await neighborhood.save();

  neighborhood = await Neighborhood.findOne({
    name: neighborhoodName
  })
    .populate('admins')
    .populate('neighbours');

  //Notify admins of the neighborhood
  await sendNotificationToAdmin(neighborhood.admins, {
    neighbour,
    neighborhood
  });

  return neighborhood;
};

const sendNotificationToAdmin = async (admins, data) => {
  for (var adm of admins) {
    await sendMailAdminNotification(adm.email, { ...data, adm });
  }
};

const deleteNeighbourFromNeighborhood = async (
  admin,
  neighborhoodId,
  neigbhourId,
  leaveNeighborhood
) => {
  //Check if admin is admin of neighborhood (admin is already the model)
  var neighbour = await Neighbour.findOne({ _id: neigbhourId });
  if (!leaveNeighborhood) {
    var neighborhood = await Neighborhood.findOne({
      _id: neighborhoodId,
      admins: mongoose.Types.ObjectId(admin._id)
    });
  } else {
    neighborhood = await Neighborhood.findOne({
      _id: neighborhoodId
    });
  }

  if (!neighbour || !neighborhood) return undefined;

  neighborhood.neighbours.pull({ _id: neigbhourId });
  neighbour.neighborhoods.pull({ _id: neighborhoodId });

  await neighbour.save();
  await neighborhood.save();

  return neighborhood;
};

const sendMessage = async (admin, neighborhoodName, messagePayload) => {
  var neighborhood = await Neighborhood.findOne({
    name: neighborhoodName,
    admins: mongoose.Types.ObjectId(admin._id)
  });

  if (!neighborhood) return undefined;

  const message = new Message({
    ...messagePayload,
    _neighborhood: neighborhood._id
  });

  neighborhood.messages.addToSet(message._id);

  await neighborhood.save();
  await message.save();

  return message;
};

const addAdminToNeighborhood = async (neighborhood, user) => {
  var admin = await Admin.findOne({ email: user.email });
  if (!admin) {
    admin = await addRoleToUser(user, config.get('roles').ADMIN.db_name);
  }
  neighborhood.admins.addToSet(admin._id);
  admin.neighborhoods.addToSet(neighborhood._id);
  await neighborhood.save();
  await admin.save();

  return neighborhood;
};

const addNeighbourToNeighborhood = async (neighborhood, user) => {
  var neighbour = await Neighbour.findOne({ email: user.email });
  if (!neighbour) {
    neighbour = await addRoleToUser(
      user,
      config.get('roles').NEIGHBOUR.db_name
    );
  }
  neighborhood.neighbours.addToSet(neighbour._id);
  neighbour.neighborhoods.addToSet(neighborhood._id);
  await neighborhood.save();
  await neighbour.save();

  return neighborhood;
};

const leaveNeighborhoodAsAdmin = async (neighborhoodId, adminId) => {
  //Check if admin is admin of neighborhood (admin is already the model)
  var admin = await Admin.findOne({ _id: adminId });

  var neighborhood = await Neighborhood.findOne({
    _id: neighborhoodId
  });

  if (!admin || !neighborhood) return null;

  neighborhood.admins.pull({ _id: adminId });
  admin.neighborhoods.pull({ _id: neighborhoodId });

  await admin.save();
  await neighborhood.save();

  return neighborhood;
};

module.exports = {
  sendMessage,
  getNeighborhood,
  deleteNeighbourFromNeighborhood,
  addUserToNeighborhood,
  createNeighborhood,
  addAdminToNeighborhood,
  leaveNeighborhoodAsAdmin,
  addNeighbourToNeighborhood
};
