const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const { NODE_ENV } = process.env;

  const DB =
    NODE_ENV === 'test'
      ? config.get('db_test')
      : process.env.MONGODB_URI || config.get('db');

  const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: NODE_ENV === 'test' ? false : true
  };

  //disable deprecation warnings
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  mongoose
    .connect(DB, options)
    .then(() => {
      console.log(`Connected to MongoDB... ${DB}`);
    })
    .catch((err) => console.log('MongoDB conection failed with error ', err));
};
