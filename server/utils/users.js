const config = require('config');
const { Admin } = require('../models/admin');
const { Neighbour } = require('../models/neighbour');
const { Rubro } = require('../models/rubro');
const { Employee } = require('../models/employee');
const _ = require('lodash');
const { addUserToNeighborhood } = require('../services/neighborhoodService');
const { createNeighborhood } = require('../services/authService');

async function getUserType(user) {
  const { email, admin, employee, neighbour } = user;

  if (admin) {
    user = await Admin.findOne({ email });
  } else if (employee) {
    user = await Employee.findOne({ email });
  } else if (neighbour) {
    user = await Neighbour.findOne({ email });
  } else {
    return null;
  }
  return user;
}

async function createUser(decodedToken) {
  const { rubros, user, neighborhood } = decodedToken;

  if (user.admin) {
    const { admin: adm } = decodedToken;

    // Create neighborhood if doesnt exist
    const created = await createNeighborhood(
      neighborhood.name,
      neighborhood.address
    );

    if (!created) return null;

    // Create admin user
    let admin = new Admin(adm);
    await admin.save();

    // Join neighborhood (add user to neighborhood)
    await addUserToNeighborhood(
      neighborhood.name,
      config.get('roles').ADMIN.db_name,
      admin,
      null,
      null
    );

    let neighbour = new Neighbour(adm);
    await neighbour.save();

    // Add user to neigbhourhood (neighborhood = name)
    await addUserToNeighborhood(
      neighborhood.name,
      config.get('roles').NEIGHBOUR.db_name,
      null,
      neighbour,
      null
    );

    return { admin, neighbour };
  } else if (user.employee) {
    const { employee: userType } = decodedToken;
    let employee = new Employee(userType);
    let rubrosModel = [];
    for (let item of rubros) {
      let rub = new Rubro({
        ...item,
        issuer: employee._id,
        blackList: false
      });
      rubrosModel.push(rub);
      await rub.save();
    }

    employee['rubros'] = rubrosModel;
    await employee.save();

    return { employee };
  } else if (user.neighbour) {
    const { neighbour: neigh } = decodedToken;

    let neighbour = new Neighbour(neigh);
    await neighbour.save();

    // Add user to neigbhourhood (neighborhood = name)
    await addUserToNeighborhood(
      neighborhood,
      config.get('roles').NEIGHBOUR.db_name,
      null,
      neighbour,
      null
    );

    return { neighbour };
  } else {
    return null;
  }
}

exports.getUserType = getUserType;
exports.createUser = createUser;
