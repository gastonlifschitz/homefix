require('dotenv').config();
var fs = require('fs');
const config = require('config');
const pkg = require('../package.json');
const chalk = require('chalk');
const winston = require('winston');
var bodyParser = require('body-parser');

const log = console.log;
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*' //TODO: EN PROD PONER URL
  }
});

const start = Date.now();
//
fs.mkdirSync(process.cwd() + '/uploads', { recursive: true });

app.use(
  bodyParser.json({
    limit: '50mb'
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
  })
);

app.use(cors());
require('./startup/logging')(winston);
require('./startup/routes')(app);
require('./startup/mongodb')();

// io.use((socket, next) => {
//   const { jwt } = socket.handshake.auth;
//   if (!jwt) {
//     return next(new Error('Falta token'));
//   }
//   socket.jwt = jwt;
//   next();
// });

var connectedUsers = {};

io.on('connection', (socket) => {
  socket.on('register', function (_id) {
    socket._id = _id;
    connectedUsers[_id] = socket;
  });

  // socket.on('Input Chat Message', (msg) => {
  //   // Handle DB connection errors
  //   try {
  //     let chat = new ChatMessages({
  //       message: msg.chatMessage ? msg.chatMessage : msg.image,
  //       sender: mongoose.Types.ObjectId(msg.userId),
  //       type: msg.type,
  //       userType: msg.userType
  //     });

  //     chat.save((err, doc) => {
  //       if (err) {
  //         return;
  //       }

  //       ChatMessages.find({ _id: doc._id })
  //         .populate('sender')
  //         .exec((err, doc) => {
  //           return io.emit('Output Chat Message', doc);
  //         });
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  socket.on('private message', async (data) => {
    // let chat = new ChatMessages({
    //   message: data.chatMessage ? data.chatMessage : data.image,
    //   sender: mongoose.Types.ObjectId(data.userId),
    //   type: data.type,
    //   userType: data.userType
    // });

    // await chat.save();

    if (connectedUsers.hasOwnProperty(data.to)) {
      connectedUsers[data.to].emit('private_chat', {
        ...data,
        message: data.chatMessage ? data.chatMessage : data.image,
        sender: data.userId,
        userId: data.to,
        to: undefined,
        createdAt: data.nowTime
      });
    }
  });

  // Debug purposes only
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

//Logging only on development environment
const protocol = config.get('protocol');
const host = process.env.docker || config.get('host');
const port = process.env.PORT || config.get('port');
const env = app.get('env');

if (env === 'development') {
  const morgan = require('morgan');
  app.use(morgan('tiny'));
  console.log('morgan enabled');
} else {
  log(chalk.red('you are in P R O D'));
  require('./startup/prod')(app);
}

log(chalk.cyan(`host: ${host}\nport: ${port}\nenvironment: ${env}`));

log(
  chalk.green('%s booted in %dms - %s://%s:%s'),
  pkg.name,
  Date.now() - start,
  protocol,
  host,
  port
);

server.listen(port, '0.0.0.0', () => {
  sendBootStatus('ready');
});

function sendBootStatus(status) {
  // don't send anything if we're not running in a fork
  if (!process.send) {
    return;
  }
  process.send({ boot: status });
}

module.exports = { server, app };
