const { Employee, validate, validateEdit } = require('../models/employee');
const { UserGallery } = require('../models/userGallery');
const { Rubro } = require('../models/rubro');
const {
  deleteEmployeeMiddleware,
  isEmployee,
  validateIsSameEmployee,
  validateSearchParams,
  validateUpdateEmployee
} = require('../middleware/employeeMiddlewares');
const EmployeeService = require('../services/employeeService');
const mongoose = require('mongoose');
const { sendMailAccountVerification } = require('../utils/mail');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const getUser = require('../middleware/getUser');
const auth = require('../middleware/auth');
const config = require('config');
const {
  getOptionalUser,
  getOptionalAuth,
  validateSuperAdmin
} = require('../middleware/authMiddlewares');
const router = express.Router();

const employeeService = new EmployeeService();

// SHOULD NOT BE USED OR TWISTED - GET ALL EMPLOYEES
router.get(
  '/',
  /*auth,*/ async (req, res) => {
    await Employee.find()
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          res.status(200).json(docs);
        } else {
          res.status(404).json({
            message: 'No employees found'
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

// Get employees by rubro
router.get(
  '/byRubro/:rubroName',
  /*auth,*/ async (req, res) => {
    const { rubroName } = req.params;

    if (!config.get('areaTypes').includes(rubroName))
      return res.status(400).send({ error: true });

    let employees = await Rubro.find(
      { rubroType: rubroName, blackList: false },
      { issuer: 1 }
    )
      .lean()
      .populate('issuer', '_id name lastName description', 'Employee');
    let ListOfEmployees = [];

    for (const employee of employees) {
      ListOfEmployees.push({
        ...employee.issuer,
        profilePic:
          req.protocol +
          '://' +
          req.get('host') +
          '/api/employees/profilePic/' +
          employee.issuer._id
      });
    }

    res.send(ListOfEmployees);
  }
);

// Delete employee
router.delete('/:id', deleteEmployeeMiddleware, async (req, res) => {
  const { user } = req;

  await employeeService.deleteEmployee(user);

  res.status(200).json(true);
});

// Ge employee profile pic
router.get(
  '/profilePic/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;

    const { email } = await Employee.findById(id);

    const userGallery = await UserGallery.findOne({ email });

    if (userGallery && userGallery.profilePic) {
      res.send(
        Buffer.from(userGallery.profilePic.split(';base64,')[1], 'base64')
      );
      return;
    }

    res.status(404).send(null);
  }
);

// Get employee by id
router.get(
  '/:id',
  /*auth,*/ async (req, res) => {
    const { id: _id } = req.params;
    let employee = await Employee.findOne({
      _id: mongoose.Types.ObjectId(_id),
      blackList: false
    })
      .lean()
      .populate('rubros');
    if (!employee)
      return res
        .status(400)
        .send(
          'No se encontro al empleado o su usuario se encuentra bloqueado.'
        );

    res.send(Employee.toGetApiEmployeeSchema(employee, req));
  }
);

// Create employee
router.post('/', async (req, res) => {
  const { error } = validate(_.omit(req.body, ['password', 'profilePic']));
  if (error) return res.status(400).send(error.details[0].message);

  const {
    email,
    cellPhone,
    name,
    lastName,
    description,
    rubros,
    password,
    paymentMethods,
    availableDates,
    availableHours,
    profilePic,
    selectedDistricts
  } = req.body;

  let employee = await Employee.findOne({ email });

  if (employee)
    return res.status(400).send('El email ya se encuentra registrado.');

  employee = {
    email,
    name,
    lastName,
    cellPhone,
    description,
    paymentMethods,
    availableDates,
    availableHours,
    selectedDistricts
  };

  let user = {
    email,
    password,
    employee: true
  };

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  let { password: passwordToEncrypt } = user;
  passwordToEncrypt = await bcrypt.hash(passwordToEncrypt, salt);
  user.password = passwordToEncrypt;

  const userGallery = new UserGallery({ email, profilePic });
  await userGallery.save();

  sendMailAccountVerification(email, { user, employee, rubros });

  return res.status(200).send(employee);
});

// Update employee
router.put(
  '/:id',
  [auth, getUser, validateUpdateEmployee],
  async (req, res) => {
    const { error } = validateEdit();

    if (error) return res.status(400).send(error.details[0].message);

    const {
      email,
      cellPhone,
      name,
      lastName,
      description,
      rubros,
      paymentMethods,
      availableDates,
      availableHours,
      districtIdArray,
      selectedDistricts
    } = req.body;

    for (const index in rubros) {
      if (!rubros[index]._id) {
        let rub = new Rubro({
          ...rubros[index],
          issuer: req.params.id,
          blackList: false
        });

        await rub.save();

        rubros[index] = rub;
      }
    }

    await Employee.findByIdAndUpdate(req.params.id, {
      email,
      cellPhone,
      name,
      lastName,
      description,
      rubros,
      paymentMethods,
      availableDates,
      availableHours,
      districtIdArray,
      selectedDistricts
    })
      .exec()
      .then(async (result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

// Blacklist employee
router.patch('/:id', [auth, validateSuperAdmin], async (req, res, next) => {
  const { id } = req.params;
  Employee.updateOne({ _id: id }, { $set: { blackList: req.body.blackList } })
    .exec()
    .then((result) => {
      Rubro.updateMany(
        { issuer: mongoose.Types.ObjectId(id) },
        { $set: { blackList: req.body.blackList } }
      )
        .exec()
        .then((resu) => res.status(200).json(resu));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Upload gallery
router.post('/upload-gallery/:id', isEmployee, async (req, res, next) => {
  const { email } = req.user;
  const { galleryUpload } = req.body;

  let gallery = await UserGallery.findOne({ email });

  if (gallery.imgCollection) gallery.imgCollection.push(...galleryUpload);
  else {
    gallery.imgCollection = [];
    galleryUpload.forEach((image) => gallery.imgCollection.push(image));
    //gallery.imgCollection = [...galleryUpload]
  }

  gallery
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Done upload!',
        userCreated: {
          _employee: result._employee,
          imgCollection: result.imgCollection
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get employee gallery
router.get('/gallery/:id', async (req, res) => {
  const { id } = req.params;

  const { email } = await Employee.findById(id);

  const data = await UserGallery.findOne({ email });

  res.status(200).json({
    message: 'User list retrieved successfully!',
    gallery: data
  });
});

// Get employee proposals
router.get(
  '/proposals/:id',
  [auth, getUser, validateIsSameEmployee],
  async (req, res) => {
    const { id } = req.params;

    const proposals = await employeeService.getProposals(id);

    res.status(200).send(proposals);
  }
);

router.get(
  '/all/search',
  [getOptionalAuth, getOptionalUser, validateSearchParams],
  async (req, res) => {
    const { sortByRating, query, neighborhood } = req;
    const { wildcard, areaType: rubro, page } = query;

    let employees = await employeeService.searchEmployees(
      sortByRating,
      neighborhood,
      wildcard,
      rubro,
      page,
      req.protocol + '://' + req.get('host') + '/api/employees/profilePic/'
    );

    res.status(200).send({ ...employees, sortByRating });
  }
);

module.exports = router;
