
const mongoose = require('mongoose')
const MONGO_URI = 'mongodb://usermongo:12345678@127.0.0.1:27017/admin';

mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
