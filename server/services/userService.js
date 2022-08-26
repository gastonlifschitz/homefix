const { Neighbour } = require('../models/neighbour');
const { User } = require('../models/user');
const config = require('config');
const { Admin } = require('../models/admin');
const { UserGallery } = require('../models/userGallery');

const addRoleToUser = async (userSchema, role) => {
  var user = await User.findOne({ _id: userSchema._id })
    .populate('admin')
    .populate('employee')
    .populate('neighbour');

  if (role === config.get('roles').NEIGHBOUR.db_name) {
    if (user[role]) return await Neighbour.findOne({ _id: user[role] });

    role = new Neighbour({
      name: getValueFromUser(user, 'name') || '',
      lastName: getValueFromUser(user, 'lastName') || '',
      cellphone: getValueFromUser(user, 'cellphone') || 1111111111,
      email: user.email
    });

    user.neighbour = role._id;
  } else if (role === config.get('roles').ADMIN.db_name) {
    if (user[role]) return await Admin.findOne({ _id: user[role] });

    role = new Admin({
      email: user.email,
      name: getValueFromUser(user, 'name') || '',
      lastName: getValueFromUser(user, 'lastName') || '',
      cellphone: getValueFromUser(user, 'cellphone') || 1111111111
    });

    user.admin = role._id;
  } else return null;

  // await role.save()
  user = await user.save();
  return role;
};

const getValueFromUser = (user, value) => {
  return user.neighbour
    ? user.neighbour[value]
    : user.admin
    ? user.admin[value]
    : user.employee
    ? user.employee[value]
    : undefined;
};

const getProfilePic = async (_id) => {
  const { email } = await User.findById({ _id });

  if (!email) return null;

  const userGallery = await UserGallery.findOne({ email });

  if (userGallery && userGallery.profilePic) {
    return Buffer.from(userGallery.profilePic.split(';base64,')[1], 'base64');
  }
  return null;
};

module.exports = { addRoleToUser, getProfilePic };
