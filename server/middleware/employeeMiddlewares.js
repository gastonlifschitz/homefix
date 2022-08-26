const { Employee } = require('../models/employee');
const { Neighborhood } = require('../models/neighborhood');
const { User } = require('../models/user');
const config = require('config');

//Chequea que el que hace el request sea un usuario admin
const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;

  if (!id)
    return res.status(401).send('Acceso denegado. No se encontró el usuario.');

  const user = await User.findOne({ employee: id }).populate('employee');

  if (!user) return res.status(403).send('Acceso denegado.');

  req.user = user;

  next();
};

const isEmployee = async (req, res, next) => {
  const { id } = req.params;

  if (!id)
    return res.status(401).send('Acceso denegado. No se encontró el usuario.');

  const employee = await Employee.findOne({ _id: id });

  if (!employee) return res.status(403).send('Acceso denegado.');

  req.employeeId = employee._id;
  req.user = { email: employee.email };

  next();
};

const validateIsSameEmployee = (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  if (!id)
    return res.status(401).send('Acceso denegado. No se encontró el usuario.');

  if (user.employee && user.employee._id.toString() === id) {
    return next();
  }

  return res.status(403).send('Acceso denegado.');
};

const validateNeighborhoodsQueryParams = async (req, res, next) => {
  const { neighborhood } = req.query;

  var arrayOfNeighborhoods = [];

  if (!neighborhood) return next();

  if (!Array.isArray(neighborhood)) {
    const neigh = await Neighborhood.findOne({ name: neighborhood });

    if (!neigh)
      return res.status(404).send(`El grupo ${neighborhood} no existe`);

    arrayOfNeighborhoods.push(neigh);
  } else {
    for (let neigh of neighborhood) {
      let neighAux = await Neighborhood.findOne({ name: neigh });

      if (!neighAux) return res.status(404).send(`El grupo ${neigh} no existe`);

      arrayOfNeighborhoods.push(neighAux);
    }
  }

  req.arrayOfNeighborhoods = arrayOfNeighborhoods;

  next();
};

const validateSearchParams = async (req, res, next) => {
  const { user } = req;
  const { neighborhood, areaType: rubro, page } = req.query;

  if (rubro && !config.get('areaTypes').includes(rubro))
    return res.status(400).send('Rubro invalido');

  if (page && !parseInt(page))
    return res.status(400).send('La pagina debe ser un numero');

  if (page) req.query['page'] = parseInt(page);

  if (user && neighborhood) {
    // Special order
    const neigh = await Neighborhood.findOne({ name: neighborhood });

    if (!neigh) return res.status(400).send('Grupo invalido');

    req.neighborhood = neigh;
    req.sortByRating = false;
  } else {
    // Rating order
    req.sortByRating = true;
  }

  next();
};

const validateUpdateEmployee = (req, res, next) => {
  const { email } = req.body;
  const { user } = req;
  const { id } = req.params;

  if (!email || !id || !user)
    return res
      .status(401)
      .send('Acceso denegado. Debe proveer un usuario valido.');

  console.log(user, email, id);
  if (
    user.employee &&
    user.employee._id.toString() === id &&
    user.email === email
  ) {
    return next();
  }

  return res.status(403).send('Acceso denegado.');
};

module.exports = {
  deleteEmployeeMiddleware: deleteEmployee,
  isEmployee,
  validateNeighborhoodsQueryParams,
  validateIsSameEmployee,
  validateSearchParams,
  validateUpdateEmployee
};
