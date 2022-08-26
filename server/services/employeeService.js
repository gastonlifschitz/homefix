const { Employee } = require('../models/employee');
const { Rubro } = require('../models/rubro');
const { Proposal } = require('../models/proposal');
const { Neighborhood } = require('../models/neighborhood');
const { UserGallery } = require('../models/userGallery');
const mongoose = require('mongoose');
const { User } = require('../models/user');

const EMPLOYEES_PER_PAGE = 6;

class EmployeeService {
  searchEmployees = async (
    sortByRating,
    neighborhood,
    wildcard,
    rubro,
    pageNumber,
    imageUrl
  ) => {
    if (
      wildcard &&
      (wildcard.includes('*') ||
        wildcard.includes('+') ||
        wildcard.includes('%'))
    ) {
      return {
        employees: [],
        totalPages: 1,
        currentPage: 1,
        employeesPerPage: EMPLOYEES_PER_PAGE
      };
    }

    if (sortByRating) {
      return await this.getEmployeesByRating(
        wildcard,
        rubro,
        pageNumber,
        imageUrl
      );
    } else {
      return await this.getEmployeesSorted(
        wildcard,
        rubro,
        pageNumber,
        neighborhood,
        imageUrl
      );
    }
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getEmployeesSorted = async (
    wildcard,
    rubro,
    pageNumber = 1,
    neighborhood,
    imageUrl
  ) => {
    const myNeighbours = neighborhood.neighbours.map((neighbour) =>
      mongoose.Types.ObjectId(neighbour)
    );

    const neighborhoodAddress =
      neighborhood.address.administrative_area_level_2;

    let employeeRest = EMPLOYEES_PER_PAGE;

    const countResults = await Employee.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$name', ' ', '$lastName']
          },
          profilePic: {
            $concat: [imageUrl, { $toString: '$_id' }]
          }
        }
      },
      {
        $lookup: {
          from: 'rubros',
          localField: 'rubros',
          foreignField: '_id',
          as: 'rubros'
        }
      },
      {
        $match: {
          $or: [
            {
              name: new RegExp(wildcard, 'i')
            },
            {
              lastName: new RegExp(wildcard, 'i')
            },
            {
              description: new RegExp(wildcard, 'i')
            },
            {
              fullname: new RegExp(wildcard, 'i')
            }
          ],
          rubros: { $elemMatch: { rubroType: rubro ? rubro : /.*/g } },
          blackList: false
        }
      },
      { $count: 'count' }
    ]);

    let knownEmployees = await Employee.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$name', ' ', '$lastName']
          },
          profilePic: {
            $concat: [imageUrl, { $toString: '$_id' }]
          }
        }
      },
      {
        $lookup: {
          from: 'rubros',
          localField: 'rubros',
          foreignField: '_id',
          as: 'rubros'
        }
      },
      {
        $match: {
          $or: [
            {
              name: new RegExp(wildcard, 'i')
            },
            {
              lastName: new RegExp(wildcard, 'i')
            },
            {
              description: new RegExp(wildcard, 'i')
            },
            {
              fullname: new RegExp(wildcard, 'i')
            }
          ],
          rubros: { $elemMatch: { rubroType: rubro ? rubro : /.*/g } },
          workedFor: { $in: myNeighbours },
          blackList: false
        }
      }
      // { $skip: EMPLOYEES_PER_PAGE * (pageNumber - 1) },
      // { $limit: EMPLOYEES_PER_PAGE }
    ]);

    // if (knownEmployees && knownEmployees.length === EMPLOYEES_PER_PAGE)
    //   return {
    //     knownEmployees,
    //     currentPage: pageNumber,
    //     totalPages: Math.ceil(countResults[0].count / EMPLOYEES_PER_PAGE),
    //     employeesPerPage: EMPLOYEES_PER_PAGE
    //   };

    // employeeRest = EMPLOYEES_PER_PAGE - knownEmployees.length;

    let nearEmployees = await Employee.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$name', ' ', '$lastName']
          },
          profilePic: {
            $concat: [imageUrl, { $toString: '$_id' }]
          }
        }
      },
      {
        $lookup: {
          from: 'rubros',
          localField: 'rubros',
          foreignField: '_id',
          as: 'rubros'
        }
      },
      {
        $match: {
          $or: [
            {
              name: new RegExp(wildcard, 'i')
            },
            {
              lastName: new RegExp(wildcard, 'i')
            },
            {
              description: new RegExp(wildcard, 'i')
            },
            {
              fullname: new RegExp(wildcard, 'i')
            }
          ],
          rubros: {
            $elemMatch: { rubroType: rubro ? rubro : /.*/g }
          },
          workedFor: { $nin: myNeighbours },
          selectedDistricts: {
            $elemMatch: { departamento: neighborhoodAddress }
          },
          blackList: false
        }
      }
      // { $skip: employeeRest * (pageNumber - 1) },
      // { $limit: employeeRest }
    ]);

    // if (knownEmployees.length + nearEmployees.length === EMPLOYEES_PER_PAGE)
    //   return {
    //     knownEmployees,
    //     nearEmployees,
    //     currentPage: pageNumber,
    //     totalPages: Math.ceil(countResults[0].count / EMPLOYEES_PER_PAGE),
    //     employeesPerPage: EMPLOYEES_PER_PAGE
    //   };

    // employeeRest -= nearEmployees.length;

    let restOfEmployees = await Employee.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$name', ' ', '$lastName']
          },
          profilePic: {
            $concat: [imageUrl, { $toString: '$_id' }]
          }
        }
      },
      {
        $lookup: {
          from: 'rubros',
          localField: 'rubros',
          foreignField: '_id',
          as: 'rubros'
        }
      },
      {
        $match: {
          $or: [
            {
              name: new RegExp(wildcard, 'i')
            },
            {
              lastName: new RegExp(wildcard, 'i')
            },
            {
              description: new RegExp(wildcard, 'i')
            },
            {
              fullname: new RegExp(wildcard, 'i')
            }
          ],
          workedFor: { $nin: myNeighbours },
          rubros: {
            $elemMatch: { rubroType: rubro ? rubro : /.*/g }
          },
          selectedDistricts: {
            $ne: {
              departamento: neighborhoodAddress
            }
          },
          blackList: false
        }
      }
    ]);

    restOfEmployees = restOfEmployees.filter(
      (emp) =>
        !emp.selectedDistricts.find(
          (dist) => dist.departamento === neighborhoodAddress
        )
    );

    console.log(knownEmployees);

    const { near, restOf, known } = this.paginateEmployees(
      knownEmployees,
      nearEmployees,
      restOfEmployees,
      pageNumber
    );

    return {
      knownEmployees: known,
      restOfEmployees: restOf,
      nearEmployees: near,
      currentPage: pageNumber,
      totalPages: countResults[0]
        ? Math.ceil(countResults[0].count / EMPLOYEES_PER_PAGE)
        : 1,
      employeesPerPage: EMPLOYEES_PER_PAGE
    };
  };

  paginateEmployees = (
    knownEmployees,
    nearEmployees,
    other,
    pageNumber = 1
  ) => {
    let allEmployees = [];

    knownEmployees.forEach((emp) =>
      allEmployees.push({
        emp,
        type: 'known'
      })
    );
    nearEmployees.forEach((emp) =>
      allEmployees.push({
        emp,
        type: 'near'
      })
    );
    other.forEach((emp) =>
      allEmployees.push({
        emp,
        type: 'other'
      })
    );

    allEmployees = allEmployees.slice(
      (pageNumber - 1) * EMPLOYEES_PER_PAGE,
      pageNumber * EMPLOYEES_PER_PAGE
    );

    const known = allEmployees
      .filter((emp) => emp.type === 'known')
      .map((employee) => employee.emp);
    const near = allEmployees
      .filter((emp) => emp.type === 'near')
      .map((employee) => employee.emp);
    const otherEmployees = allEmployees
      .filter((emp) => emp.type === 'other')
      .map((employee) => employee.emp);

    return {
      known,
      near,
      restOf: otherEmployees
    };
  };

  getEmployeesByRating = async (wildcard, rubro, pageNumber = 1, imageUrl) => {
    const allQueries = await Employee.aggregate([
      {
        $facet: {
          employees: [
            {
              $addFields: {
                fullname: {
                  $concat: ['$name', ' ', '$lastName']
                },
                profilePic: {
                  $concat: [imageUrl, { $toString: '$_id' }]
                }
              }
            },
            {
              $lookup: {
                from: 'rubros',
                localField: 'rubros',
                foreignField: '_id',
                as: 'rubros'
              }
            },
            {
              $match: {
                $or: [
                  {
                    name: new RegExp(wildcard, 'i')
                  },
                  {
                    lastName: new RegExp(wildcard, 'i')
                  },
                  {
                    description: new RegExp(wildcard, 'i')
                  },
                  {
                    fullname: new RegExp(wildcard, 'i')
                  }
                ],
                rubros: { $elemMatch: { rubroType: rubro ? rubro : /.*/g } },
                blackList: false
              }
            },
            { $skip: EMPLOYEES_PER_PAGE * (pageNumber - 1) },
            { $limit: EMPLOYEES_PER_PAGE }
          ],
          count: [
            {
              $addFields: {
                fullname: {
                  $concat: ['$name', ' ', '$lastName']
                },
                profilePic: {
                  $concat: [imageUrl, { $toString: '$_id' }]
                }
              }
            },
            {
              $lookup: {
                from: 'rubros',
                localField: 'rubros',
                foreignField: '_id',
                as: 'rubros'
              }
            },
            {
              $match: {
                $or: [
                  {
                    name: new RegExp(wildcard, 'i')
                  },
                  {
                    lastName: new RegExp(wildcard, 'i')
                  },
                  {
                    description: new RegExp(wildcard, 'i')
                  },
                  {
                    fullname: new RegExp(wildcard, 'i')
                  }
                ],
                rubros: { $elemMatch: { rubroType: rubro ? rubro : /.*/g } },
                blackList: false
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    return {
      employees: allQueries[0].employees,
      totalPages:
        allQueries[0].count.length === 0
          ? pageNumber
          : Math.ceil(allQueries[0].count[0].count / EMPLOYEES_PER_PAGE),
      currentPage: pageNumber,
      employeesPerPage: EMPLOYEES_PER_PAGE
    };
  };

  deleteEmployee = async (user) => {
    const { email, employee } = user;
    const { _id } = employee;

    // Remove employee and rubro
    Employee.remove({ email, blackList: false })
      .exec()
      .then(() => {
        User.remove({ email }).exec();
        UserGallery.remove({ email }).exec();
        Rubro.remove({ issuer: mongoose.Types.ObjectId(_id) }).exec();
      });
  };

  getEmployees = async (arrayOfNeighborhoods) => {
    // 1. Employees that worked in any of arrayOfNeighborhoods, ordered by stars (TBD)
    const neighIds = arrayOfNeighborhoods.map((a) => a._id);
    let districts = arrayOfNeighborhoods.map((a) =>
      a.address ? a.address.administrative_area_level_2 : undefined
    );

    var allOfMyNeighboursIds = [];

    for (let nId of neighIds) {
      const neighborhood = await Neighborhood.findOne({ _id: nId });
      if (neighborhood && neighborhood.neighbours) {
        allOfMyNeighboursIds.push(...neighborhood.neighbours);
      }
    }

    allOfMyNeighboursIds = [...new Set(allOfMyNeighboursIds)];

    districts = [...new Set(districts)];

    let trustedEmployees = [],
      nearEmployees = [],
      allOtherEmployees = [];

    trustedEmployees = await Employee.find({
      workedFor: { $in: allOfMyNeighboursIds }
    });

    // 2. Employees that area near any of arrayOfNeighborhoods, ordered by stars (TBD)
    // Check: Eliminar empleados repetidos
    nearEmployees = await Employee.find(
      {
        selectedDistricts: {
          $elemMatch: { departamento: { $in: districts } }
        }
        //$nor: employees
      }
      // ,
      // {
      //   $not: { $in: ['_id', employeeIds] }
      // }
    );

    nearEmployees = nearEmployees.filter(
      (elem) => !trustedEmployees.find(({ _id }) => elem._id.equals(_id))
    );

    // // 3. Rest of employees, ordered by stars (TBD)
    allOtherEmployees = await Employee.find();

    allOtherEmployees = allOtherEmployees.filter(
      (elem) => !trustedEmployees.find(({ _id }) => elem._id.equals(_id))
    );

    allOtherEmployees = allOtherEmployees.filter(
      (elem) => !nearEmployees.find(({ _id }) => elem._id.equals(_id))
    );

    return { trustedEmployees, nearEmployees, allOtherEmployees };
  };

  getProposals = async (_provider) => {
    const waitingProposals = await Proposal.find({
      _provider,
      state: 'WAIT'
    })
      .populate('_receiver')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    const acceptedProposals = await Proposal.find({
      _provider,
      state: 'ACCEPT'
    })
      .populate('_receiver')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    const finalizedProposals = await Proposal.find({
      _provider,
      state: 'FINALIZED'
    })
      .populate('_receiver')
      .populate('_review')
      .sort({ updatedAt: 'descending' });

    return {
      waitingProposals,
      acceptedProposals,
      finalizedProposals
    };
  };
}

module.exports = EmployeeService;
