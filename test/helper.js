const mongoose = require('mongoose');
const supertest = require('supertest');
// const server = require('../server/server');
const { app } = require('../server/server');
const { User } = require('../server/models/user');
const { Neighbour } = require('../server/models/neighbour');
const { Admin } = require('../server/models/admin');
const { Neighborhood } = require('../server/models/neighborhood');
const { Employee } = require('../server/models/employee');
const { Rubro } = require('../server/models/rubro');
const { UserGallery } = require('../server/models/userGallery');
const { Message } = require('../server/models/messages');
const { ChatMessage } = require('../server/models/chatMessage');
const { ChatInfo } = require('../server/models/chatInfo');
const { Review } = require('../server/models/review');
const { Proposal } = require('../server/models/proposal');
const { SuperAdmin } = require('../server/models/superAdmin');
const api = supertest(app);

const userIds = [
  mongoose.Types.ObjectId('111111111111111111111110'),
  mongoose.Types.ObjectId('222222222222222222222220'),
  mongoose.Types.ObjectId('333333333333333333333330'),
  mongoose.Types.ObjectId('444444444444444444444440'),
  mongoose.Types.ObjectId('555555555555555555555550'),
  mongoose.Types.ObjectId('666666666666666666666660'),
  mongoose.Types.ObjectId('777777777777777777777770'),
  mongoose.Types.ObjectId('888888888888888888888880')
];

const userGalleryIds = [
  mongoose.Types.ObjectId('11111111111111111111111f'),
  mongoose.Types.ObjectId('22222222222222222222222f'),
  mongoose.Types.ObjectId('33333333333333333333333f'),
  mongoose.Types.ObjectId('44444444444444444444444f'),
  mongoose.Types.ObjectId('55555555555555555555555f'),
  mongoose.Types.ObjectId('66666666666666666666666f'),
  mongoose.Types.ObjectId('77777777777777777777777f'),
  mongoose.Types.ObjectId('88888888888888888888888f')
];

const neighborhoodsIds = [
  mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbb1'),
  mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbb2')
];

const adminsIds = [
  mongoose.Types.ObjectId('44444444444444444444444a'),
  mongoose.Types.ObjectId('55555555555555555555555a')
];

const neighboursIds = [
  mongoose.Types.ObjectId('44444444444444444444444b'),
  mongoose.Types.ObjectId('55555555555555555555555b'),
  mongoose.Types.ObjectId('66666666666666666666666b'),
  mongoose.Types.ObjectId('77777777777777777777777b'),
  mongoose.Types.ObjectId('88888888888888888888888b')
];

const employeeIds = [
  mongoose.Types.ObjectId('11111111111111111111111e'),
  mongoose.Types.ObjectId('22222222222222222222222e'),
  mongoose.Types.ObjectId('33333333333333333333333e')
];

const rubrosIds = [
  mongoose.Types.ObjectId('abc111111111111111111111'),
  mongoose.Types.ObjectId('abc222222222222222222222'),
  mongoose.Types.ObjectId('abc333333333333333333333')
];

const messageIds = [
  mongoose.Types.ObjectId('abcdef111111111111111111'),
  mongoose.Types.ObjectId('abcdef222222222222222222')
];

const chatInfoIds = [
  mongoose.Types.ObjectId('ca1111111111111111111111'),
  mongoose.Types.ObjectId('ca2222222222222222222222'),
  mongoose.Types.ObjectId('ca3333333333333333333333')
];

const chatMessagesIds = [
  mongoose.Types.ObjectId('cb1111111111111111111111'),
  mongoose.Types.ObjectId('cb1111111111111111111112'),
  mongoose.Types.ObjectId('cb2222222222222222222221'),
  mongoose.Types.ObjectId('cb2222222222222222222222')
];

const proposalIds = [
  mongoose.Types.ObjectId('cf1111111111111111111111'),
  mongoose.Types.ObjectId('cf2222222222222222222222')
];

const reviewsIds = [mongoose.Types.ObjectId('d11111111111111111111111')];

const superAdmin = [
  {
    _id: mongoose.Types.ObjectId('62ccb0a44dffe70633b45f4b'),
    email: 'homefix@gmail.com',
    password: '$2b$10$mU/XTuHsGHwOk8EFbnnGZeB05eawqEe4locLokOgIaGxW.6lcWJjO'
  }
];

const users = [
  {
    _id: mongoose.Types.ObjectId('111111111111111111111110'),
    resetLink: '',
    email: 'mica@yopmail.com',
    password: '$2b$10$1mokI/.DhthYm71chsgyGOw/FTZkjgfiWJ/Sg/irL7GNZwcqTfPBq',
    employee: mongoose.Types.ObjectId('11111111111111111111111e')
  },
  {
    _id: mongoose.Types.ObjectId('222222222222222222222220'),
    resetLink: '',
    email: 'maria@yopmail.com',
    password: '$2b$10$QJiTLa6lE4rUHkhBLpQ8cObHwySWDLMWpQtwNIq22sv8K7ZFTaVUu',
    employee: mongoose.Types.ObjectId('22222222222222222222222e')
  },
  {
    _id: mongoose.Types.ObjectId('333333333333333333333330'),
    resetLink: '',
    email: 'laura@yopmail.com',
    password: '$2b$10$axj8fN/OxxNDkUjjkdVT7u3lwUQ7xiXGK09rYyMzlZNnWH8l9FI1O',
    employee: mongoose.Types.ObjectId('33333333333333333333333e')
  },
  {
    _id: mongoose.Types.ObjectId('444444444444444444444440'),
    resetLink: '',
    email: 'dario@yopmail.com',
    password: '$2b$10$2nXQVxxg1t2goQjEiqWsCu6ACijRzwdZXMBjzqR7ik1gxk4df6uxm',
    admin: mongoose.Types.ObjectId('44444444444444444444444a'),
    neighbour: mongoose.Types.ObjectId('44444444444444444444444b')
  },
  {
    _id: mongoose.Types.ObjectId('555555555555555555555550'),
    resetLink: '',
    email: 'elena@yopmail.com',
    password: '$2b$10$ymVu2KK7yfpfeIh8iDherOz1iLkQ9qrzH9w4PW7VRronzv.1U7Yxi',
    admin: mongoose.Types.ObjectId('55555555555555555555555a'),
    neighbour: mongoose.Types.ObjectId('55555555555555555555555b')
  },
  {
    _id: mongoose.Types.ObjectId('666666666666666666666660'),
    resetLink: '',
    email: 'roberta@yopmail.com',
    password: '$2b$10$KK94C/2Bi5jwazMEi2cQl.a0oZYLRhAbYAWp5RfxTa4xQhSUUMVk2',
    neighbour: mongoose.Types.ObjectId('66666666666666666666666b')
  },
  {
    _id: mongoose.Types.ObjectId('777777777777777777777770'),
    resetLink: '',
    email: 'analia@yopmail.com',
    password: '$2b$10$jmhF2XacNx7JUEZ8hPKowexoZPvDxiAH7z//Uic7BvXwhaI/vCYbO',
    neighbour: mongoose.Types.ObjectId('77777777777777777777777b')
  },
  {
    _id: mongoose.Types.ObjectId('888888888888888888888880'),
    resetLink: '',
    email: 'jorge@yopmail.com',
    password: '$2b$10$coPtKUUpbFvceabJNC6tke58aosbmIPHBh6Ti0eQ/3nc0yTY/9R5K',
    neighbour: mongoose.Types.ObjectId('88888888888888888888888b')
  }
];

const neighbours = [
  {
    _id: mongoose.Types.ObjectId('44444444444444444444444b'),
    neighborhoods: [neighborhoodsIds[0]],
    name: 'dario',
    lastName: 'dario',
    cellphone: '1111111111',
    email: 'dario@yopmail.com'
  },
  {
    _id: mongoose.Types.ObjectId('55555555555555555555555b'),
    neighborhoods: [neighborhoodsIds[0]],
    name: 'elena',
    lastName: 'elena',
    cellphone: '1111111111',
    email: 'elena@yopmail.com'
  },
  {
    _id: mongoose.Types.ObjectId('66666666666666666666666b'),
    neighborhoods: [neighborhoodsIds[1]],
    name: 'roberta',
    lastName: 'roberta',
    cellphone: '1111111111',
    email: 'roberta@yopmail.com'
  },
  {
    _id: mongoose.Types.ObjectId('77777777777777777777777b'),
    neighborhoods: [neighborhoodsIds[1]],
    name: 'analia',
    lastName: 'analia',
    cellphone: '1111111111',
    email: 'analia@yopmail.com'
  },
  {
    _id: mongoose.Types.ObjectId('88888888888888888888888b'),
    neighborhoods: [neighborhoodsIds[0], neighborhoodsIds[1]],
    name: 'jorge',
    lastName: 'jorge',
    cellphone: '1111111111',
    email: 'jorge@yopmail.com'
  }
];

const admins = [
  {
    _id: adminsIds[0],
    neighborhoods: [neighborhoodsIds[0]],
    name: 'dario',
    lastName: 'dario',
    cellphone: '1111111111',
    email: 'dario@yopmail.com'
  },
  {
    _id: adminsIds[1],
    neighborhoods: [neighborhoodsIds[1]],
    name: 'elena',
    lastName: 'elena',
    cellphone: '1111111111',
    email: 'elena@yopmail.com'
  }
];

// Mensajes parroquiales
const messages = [
  {
    _id: messageIds[0],
    message: 'Hola a todos bienvenidos al grupito!',
    title: 'Mensaje 1',
    _neighborhood: neighborhoodsIds[0]
  },
  {
    _id: messageIds[1],
    message: 'Pizza gratis!',
    title: 'Mensaje 2',
    _neighborhood: neighborhoodsIds[1]
  }
];

const neighborhoods = [
  {
    _id: neighborhoodsIds[0],
    admins: [adminsIds[0]],
    neighbours: [neighboursIds[0], neighboursIds[1], neighboursIds[4]],
    messages: [messages[0]._id],
    workers: [],
    blackList: [],
    name: 'Norte',
    address: {
      lat: -34.4475819,
      lng: -58.5355953,
      address: 'Carlos Casares 410, Victoria, Buenos Aires Province, Argentina',
      administrative_area_level_2: 'SAN FERNANDO'
    }
  },
  {
    _id: neighborhoodsIds[1],
    admins: [adminsIds[1]],
    neighbours: [neighboursIds[2], neighboursIds[3], neighboursIds[4]],
    messages: [messages[1]._id],
    workers: [],
    blackList: [],
    name: 'Sur',
    address: {
      lat: -34.9126357,
      lng: -57.94433109999999,
      address:
        'Dirección de Servicios Sociales Universidad Nacional de La Plata, Avenida 53, La Plata, Buenos Aires Province, Argentina',
      administrative_area_level_2: 'LA PLATA'
    }
  }
];

const employees = [
  {
    _id: employeeIds[0],
    rubros: [rubrosIds[0]],
    paymentMethods: ['Efectivo', 'Tarjeta'],
    availableDates: [false, true, true, false, true, false, false],
    availableHours: [0, 2, 3, 0, 3, 0, 0],
    workedFor: [],
    blackList: false,
    selectedDistricts: [
      {
        id: 93,
        departamento: 'LA PLATA',
        cabecera: 'LA PLATA',
        provincia: 'BUENOS AIRES'
      },
      {
        id: 167,
        departamento: 'SAN FERNANDO',
        cabecera: 'SAN FERNANDO',
        provincia: 'BUENOS AIRES'
      }
    ],
    email: 'mica@yopmail.com',
    name: 'mica',
    lastName: 'mica',
    cellPhone: '1111111111',
    description: 'mica'
  },
  {
    _id: employeeIds[1],
    rubros: [rubrosIds[1]],
    paymentMethods: ['Efectivo'],
    availableDates: [false, true, true, false, true, false, false],
    availableHours: [0, 2, 3, 0, 3, 0, 0],
    workedFor: [],
    blackList: false,
    selectedDistricts: [
      {
        id: 93,
        departamento: 'LA PLATA',
        cabecera: 'LA PLATA',
        provincia: 'BUENOS AIRES'
      },
      {
        id: 167,
        departamento: 'SAN FERNANDO',
        cabecera: 'SAN FERNANDO',
        provincia: 'BUENOS AIRES'
      }
    ],
    email: 'maria@yopmail.com',
    name: 'maria',
    lastName: 'maria',
    cellPhone: '1111111111',
    description: 'maria'
  },
  {
    _id: employeeIds[2],

    rubros: [rubrosIds[2]],
    paymentMethods: ['Tarjeta'],
    availableDates: [false, true, true, false, true, false, false],
    availableHours: [0, 2, 3, 0, 3, 0, 0],
    workedFor: [],
    blackList: false,
    selectedDistricts: [
      {
        id: 93,
        departamento: 'LA PLATA',
        cabecera: 'LA PLATA',
        provincia: 'BUENOS AIRES'
      }
    ],
    email: 'laura@yopmail.com',
    name: 'laura',
    lastName: 'laura',
    cellPhone: '1111111111',
    description: 'laura'
  }
];

const userGalleries = [
  {
    _id: userGalleryIds[0],
    imgCollection: [],
    email: 'mica@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[1],
    imgCollection: [],
    email: 'maria@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[2],
    imgCollection: [],
    email: 'laura@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[3],
    imgCollection: [],
    email: 'dario@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[4],
    imgCollection: [],
    email: 'elena@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[5],
    imgCollection: [],
    email: 'roberta@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[6],
    imgCollection: [],
    email: 'analia@yopmail.com',
    profilePic: null
  },
  {
    _id: userGalleryIds[7],
    imgCollection: [],
    email: 'jorge@yopmail.com',
    profilePic: null
  }
];

const rubros = [
  {
    _id: rubrosIds[0],
    services: ['Mesas'],
    blackList: false,
    rubroType: 'CARPINTER',
    issuer: employeeIds[0]
  },
  {
    _id: rubrosIds[1],
    services: ['Sillas'],
    blackList: false,
    rubroType: 'CARPINTER',
    issuer: employeeIds[1]
  },
  {
    _id: rubrosIds[2],
    services: ['Paredes'],
    blackList: false,
    rubroType: 'PLUMER',
    issuer: employeeIds[2]
  }
];
const chatInfos = [
  {
    _id: chatInfoIds[0],
    _provider: employeeIds[0],
    _receiver: neighboursIds[0]
  },
  {
    _id: chatInfoIds[1],
    _provider: employeeIds[0],
    _receiver: neighboursIds[1]
  },
  {
    _id: chatInfoIds[2],
    _provider: employeeIds[1],
    _receiver: neighboursIds[1]
  }
];

const chatMessages = [
  {
    _id: chatMessagesIds[0],
    message: 'Hola, como estas?',
    sender: neighboursIds[0],
    type: 'Text',
    userType: 'Neighbour',
    chatId: chatInfoIds[0]
  },
  {
    _id: chatMessagesIds[1],
    message: 'Bien, vos?',
    sender: employeeIds[0],
    type: 'Text',
    userType: 'Employee',
    chatId: chatInfoIds[0]
  },
  {
    _id: chatMessagesIds[2],
    message: 'Cuanto la limpieza del auto?',
    sender: neighboursIds[1],
    type: 'Text',
    userType: 'Neighbour',
    chatId: chatInfoIds[1]
  },
  {
    _id: chatMessagesIds[3],
    message: '500 pesos',
    sender: employeeIds[0],
    type: 'Text',
    userType: 'Employee',
    chatId: chatInfoIds[1]
  }
];

const proposals = [
  {
    _id: proposalIds[0],
    state: 'FINALIZED',
    price: 500.0,
    title: 'Mesa de trabajo',
    description: '',
    serviceType: 'CARPINTER',
    _receiver: chatInfos[0]._receiver,
    _provider: chatInfos[0]._provider,
    chatId: chatInfoIds[0],
    _review: reviewsIds[0]
  },
  {
    _id: proposalIds[1],
    state: 'ACCEPT',
    price: 10000,
    title: 'Silla de trabajo',
    description: '',
    serviceType: 'CARPINTER',
    _receiver: chatInfos[1]._receiver,
    _provider: chatInfos[1]._provider,
    chatId: chatInfoIds[1]
  }
];

const reviews = [
  {
    _id: reviewsIds[0],
    report: false,
    reports: [],
    likes: [userIds[6]],
    disLikes: [],
    _employee: employeeIds[0],
    comment: 'Muy buen trabajo',
    rating: 5,
    _issuer: chatInfos[0]._receiver
  }
];

const insertUsers = async () => {
  for (let user of users) {
    const userObject = new User(user);
    await userObject.save();
  }
};

const insertNeighbours = async () => {
  for (let neighbour of neighbours) {
    const neighbourObject = new Neighbour(neighbour);
    await neighbourObject.save();
  }
};

const insertAdmins = async () => {
  for (let admin of admins) {
    const adminObject = new Admin(admin);
    await adminObject.save();
  }
};

const insertEmployees = async () => {
  for (let employee of employees) {
    const employeeObject = new Employee(employee);
    await employeeObject.save();
  }
};

const insertRubros = async () => {
  for (let rubro of rubros) {
    const rubroObject = new Rubro(rubro);
    await rubroObject.save();
  }
};

const insertNeighborhoods = async () => {
  for (let neighborhood of neighborhoods) {
    const neighborhoodObject = new Neighborhood(neighborhood);
    await neighborhoodObject.save();
  }
};

const insertUserGalleries = async () => {
  for (let userGallery of userGalleries) {
    const userGalleryObject = new UserGallery(userGallery);
    await userGalleryObject.save();
  }
};

const insertMessages = async () => {
  for (let message of messages) {
    const messageObject = new Message(message);
    await messageObject.save();
  }
};

const insertChatMessages = async () => {
  for (let chatMessage of chatMessages) {
    const chatMessageObject = new ChatMessage(chatMessage);
    await chatMessageObject.save();
  }
};

const insertChatInfo = async () => {
  for (let chatInfo of chatInfos) {
    const chatInfoObject = new ChatInfo(chatInfo);
    await chatInfoObject.save();
  }
};

const insertReviews = async () => {
  for (let review of reviews) {
    const reviewObject = new Review(review);
    await reviewObject.save();
  }
};

const insertProposals = async () => {
  for (let proposal of proposals) {
    const proposalObject = new Proposal(proposal);
    await proposalObject.save();
  }
};

const insertSuperAdmin = async () => {
  for (let adm of superAdmin) {
    const proposalObject = new SuperAdmin(adm);
    await proposalObject.save();
  }
};

const clearDatabase = async () => {
  await User.deleteMany({});
  await Neighbour.deleteMany({});
  await Admin.deleteMany({});
  await Neighborhood.deleteMany({});
  await Employee.deleteMany({});
  await Rubro.deleteMany({});
  await UserGallery.deleteMany({});
  await Message.deleteMany({});
  await ChatMessage.deleteMany({});
  await ChatInfo.deleteMany({});
  await Review.deleteMany({});
  await Proposal.deleteMany({});
  await SuperAdmin.deleteMany({});
};

const insertAll = async () => {
  await insertUsers();
  await insertNeighbours();
  await insertAdmins();
  await insertNeighborhoods();
  await insertEmployees();
  await insertRubros();
  await insertUserGalleries();
  await insertMessages();
  await insertChatMessages();
  await insertChatInfo();
  await insertProposals();
  await insertReviews();
  await insertSuperAdmin();
};

const loginUsers = async (tokens) => {
  for (let user of users) {
    const token = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: '111' });
    tokens.push(token.body ? token.body.token : undefined);
  }

  for (let adm of superAdmin) {
    const token = await api
      .post('/api/superAdmin/login')
      .send({ email: adm.email, password: '111' });
    tokens.push(token.body ? token.body.token : undefined);
  }
};

module.exports = {
  users,
  messages,
  api,
  neighborhoods,
  chatMessages,
  chatInfoIds,
  neighboursIds,
  rubros,
  neighbours,
  proposals,
  employeeIds,
  rubrosIds,
  proposalIds,
  reviews,
  admins,
  insertUsers,
  insertNeighbours,
  insertAdmins,
  clearDatabase,
  insertAll,
  loginUsers
};
